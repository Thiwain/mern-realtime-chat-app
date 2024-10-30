import { Box, Typography } from "@mui/joy";

const AuthFooter = () => {
    return (
        <Box component="footer" sx={{ py: 3 }}>
            <Typography level="body-xs" sx={{ textAlign: 'center' }}>
                © Your company {new Date().getFullYear()}
            </Typography>
        </Box>
    );
};

export default AuthFooter;