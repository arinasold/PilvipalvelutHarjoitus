import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { firestore } from '../firebaseConfig';
import { collection, getDocs, query, where, addDoc} from 'firebase/firestore';
import { Link } from 'react-router-dom';

interface Activity {
  id: number;
  name: string;
  pictures: string[]; // Assuming pictures is an array of strings
  addedToFavorite: boolean; // New property to track whether activity is added to favorite
}

// Define custom shades of pink
const theme = createTheme({
  palette: {
    primary: {
      main: '#E0C2FF', 
      light: '#C187EE', 
      dark: '#C187EE', 
    },
  },
});

function Activities() {
  
  const [randomActivity, setRandomActivity] = useState<Activity | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      // Fetch the access token
      const tokenResponse = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials&client_id=mkOTVnp1iCi5GAsDZxOvuQ6zecOFgVzG&client_secret=XJXVbKIU3tENGSqc', // Replace with your client id and secret
      });
      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // Fetch the activities
      const response = await fetch('https://test.api.amadeus.com/v1/shopping/activities?latitude=60.1699&longitude=24.9384&radius=5', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      
      if (data.data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.data.length);
        setRandomActivity({ ...data.data[randomIndex], addedToFavorite: false });
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const handleAddData = async () => {
    try {
      console.log("Adding data...");
      if (randomActivity) {
        // Check if the activity ID already exists
        const activityRef = collection(firestore, 'Activities');
        const querySnapshot = await getDocs(query(activityRef, where('id', '==', randomActivity.id)));
        if (querySnapshot.empty) {
          // If no document with the same ID exists, add the activity
          const docRef = await addDoc(activityRef, randomActivity);
          console.log("Document added with ID: ", docRef.id);
          console.log("Data added successfully!");
          setRandomActivity({ ...randomActivity, addedToFavorite: true });
        } else {
          console.log("Activity with ID already exists. Not adding.");
        }
      } else {
        console.log("No random activity available to add.");
      }
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
    <div className="activities-container">
      <header className="activities-header">
        <h1>Activities in Helsinki</h1>
        <div className="button-container">
        <Stack spacing={2} direction="row">

          <Button variant="contained" color='primary' endIcon={<SearchIcon/>} onClick={fetchActivities} >Find Activity</Button>
          <Button component={Link} to="/favorites" variant="contained" color='primary' endIcon={<FavoriteIcon/>}>Favorites</Button>
        </Stack>
        </div>
      </header>
      {randomActivity && (
        <div className="activity-card">
          <h3>{randomActivity.name}</h3>
          {randomActivity.pictures.length > 0 && (
            <img
              src={randomActivity.pictures[0]}
              alt={randomActivity.name}
              className="activity-image"
            />
          )}
          <div className="button-container">
          <Button
                variant="contained"
                color={randomActivity.addedToFavorite ? 'success' : 'primary'}
                endIcon={<AddIcon />}
                onClick={handleAddData}
              >
                {randomActivity.addedToFavorite ? 'Added' : 'Add to Favorites'}
              </Button>
      </div>
        </div>
      )}
    </div>
    </ThemeProvider>
  );
}


export default Activities;

