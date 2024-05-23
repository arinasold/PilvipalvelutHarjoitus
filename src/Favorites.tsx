import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { firestore } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

interface Activity {
  id: string;
  name: string;
  pictures: string[];

}

const theme = createTheme({
  palette: {
    primary: {
      main: '#E0C2FF', 
      light: '#C187EE', 
      dark: '#C187EE', 
    },
    error: {
      main: '#EE8798', 
      light: '#C187EE', 
      dark: '#EF5977', 
    }
  },

});

export default function Favorites() {
  const [favoriteActivities, setFavoriteActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetchFavoriteActivities();
  }, []);

  const fetchFavoriteActivities = async () => {
    try {
      const activityRef = collection(firestore, 'Activities');
      const querySnapshot = await getDocs(activityRef);
      const activities: Activity[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const activity: Activity = {
          id: doc.id, // Assigning the id property manually
          name: data.name,
          pictures: data.pictures,
          
        };
        activities.push(activity);
      });
      setFavoriteActivities(activities);
    } catch (error) {
      console.error('Error fetching favorite activities:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(firestore, 'Activities', id));
      setFavoriteActivities(prevActivities => prevActivities.filter(activity => activity.id !== id));
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };


  return (
    <ThemeProvider theme={theme}>
    <div className="activities-container">
      <header className="activities-header">
        <h1>Favorite Activities <FavoriteIcon/></h1>
        <div className="button-container">
        <Button component={Link} to="/" variant="contained" color='primary' endIcon={<SearchIcon/>}>Find more</Button> 
        </div>
      </header>
      <div className="activities-list">
        {favoriteActivities.map((activity) => (
          <div key={activity.id} className="activity-card">
            <h3>{activity.name}</h3>
            {activity.pictures.length > 0 && (
              <img
                src={activity.pictures[0]}
                alt={activity.name}
                className="activity-image"
              />
            )}
            <div className="button-container">
            <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDelete(activity.id)}
              >
                Delete
              </Button>
              </div>
          </div>
        ))}
      </div>
    </div>
    </ThemeProvider>
  );
}