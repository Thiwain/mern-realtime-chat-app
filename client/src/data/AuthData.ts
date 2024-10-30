

export const AuthData = {
    loginData: {
        title: 'Log In',
        routeMessage: "Don't have an account?",
        route: '/signup',
        routeTitle: 'Sign Up',
    },
    signupData: {
        title: 'Sign Up',
        routeMessage: "Already have an account?",
        route: '/login',
        routeTitle: 'Log In',
    },
    emailField: {
        label: 'Email',
        type: 'email',
        name: 'email',
        required: true,
    },
    passwordField: {
        label: 'Password',
        type: 'password',
        name: 'password',
        required: true,
    },
    rePasswordField: {
        label: 'Re-Type Password',
        type: 'password',
        name: 'rePassword',
        required: true,
    }
};