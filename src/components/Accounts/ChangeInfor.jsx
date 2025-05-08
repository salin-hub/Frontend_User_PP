import { useState } from 'react';
import axios from '../../API/axios';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { useLocation } from 'react-router-dom';

const UpdateAccount = () => {
    const location = useLocation();
  const [name, setName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const email = location.state?.email;
  const userId = localStorage.getItem('userID'); // Replace with dynamic user ID (you can get this from the user’s session or localStorage)

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password confirmation
    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true); // Show loading indicator
    const requestData = {
      name,
      old_password: oldPassword,
      password,
      password_confirmation: passwordConfirmation,
    };

    try {
      // Make API call to update the account
      const response = await axios.put(
        `users/${userId}`, // Replace with your actual API endpoint
        requestData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`, // Ensure the token is saved after login
          },
        }
      );

      // Handle success response
      setSuccessMessage(response.data.message);
      setError(null); // Clear any previous error
    } catch (err) {
      setError(err.response ? err.response.data.error : 'Something went wrong');
      setSuccessMessage(null); // Clear success message if any error occurs
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

  return (
    <Container maxWidth="sm">

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5}}>
        <Typography variant="h5">Update Account</Typography>

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        {successMessage && (
          <Typography color="success" variant="body2" sx={{ mt: 2 }}>
            {successMessage}
          </Typography>
        )}
        {email && (
        <p><strong>Email: </strong>{email}</p> // Display email above the form
      )}

        <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 20 }}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
            required
          />

          <TextField
            label="Old Password"
            type="password"
            variant="outlined"
            fullWidth
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            sx={{ mb: 2 }}
            required
          />

          <TextField
            label="New Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
            required
          />

          <TextField
            label="Confirm New Password"
            type="password"
            variant="outlined"
            fullWidth
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            sx={{ mb: 2 }}
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={isLoading} // Disable button during loading
          >
            {isLoading ? 'Updating...' : 'Update Account'}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default UpdateAccount;
