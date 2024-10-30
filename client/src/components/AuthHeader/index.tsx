import IconButton, { IconButtonProps } from '@mui/joy/IconButton';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import React from 'react';
import { Box, Typography, useColorScheme } from '@mui/joy';


function ColorSchemeToggle(props: IconButtonProps) {
    const { onClick, ...other } = props;
    const { mode, setMode } = useColorScheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => setMounted(true), []);

    return (
        <IconButton
            aria-label="toggle light/dark mode"
            size="sm"
            variant="outlined"
            disabled={!mounted}
            onClick={(event) => {
                setMode(mode === 'light' ? 'dark' : 'light');
                onClick?.(event);
            }}
            {...other}
        >
            {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
        </IconButton>
    );
}

const AuthHeader = () => {
    return (
        <Box
            component="header"
            sx={{ py: 3, display: 'flex', justifyContent: 'space-between' }}
        >
            <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
                <IconButton variant="soft" color="primary" size="sm">
                    <BadgeRoundedIcon />
                </IconButton>
                <Typography level="title-lg">Asteroid Chat</Typography>
            </Box>
            <ColorSchemeToggle />
        </Box>
    )
}

export default AuthHeader;