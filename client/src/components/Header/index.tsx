import {Box, Button, Typography} from "@mui/material";
import {logoutRequest} from "../../api/services/auth.ts";

const handleLogout = async () => {
    try {
        await logoutRequest();
        setTimeout(() => {
            window.location.reload();
        }, 200);
    } catch (error) {
        console.error('Error logging out', error);
        alert('Failed to log out. Please try again.');
    }
};

const Header=()=>{
    return(
        <Box display="flex" alignItems="center" p={2} sx={{ borderBottom: '1px solid #ccc' }}>
            <Typography variant="h5" fontWeight="bold">
                🏚️ ChatRoom
            </Typography>
            <Button
                onClick={handleLogout}
                variant="outlined"
                color="error"
                sx={{ ml: 3 }}
            >
                ⚠️ Logout
            </Button>
        </Box>
    );
}

export default Header;