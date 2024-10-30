
const NotificationButton = () => {
    const handleNotificationClick = () => {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        } else if (Notification.permission === "granted") {
            showNotification();
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    showNotification();
                } else {
                    alert("Notification permissions were denied.");
                }
            }).catch(error => {
                console.error("Permission request failed:", error);
            });
        }
    };

    const showNotification = () => {
        const notification = new Notification("Hello!", {
            body: "This is your custom notification.",
            icon: "https://via.placeholder.com/50" // Optional icon
        });

        notification.onclick = () => {
            window.focus(); // Optional: bring the app back to focus on click
        };
    };

    return (
        <button onClick={handleNotificationClick}>
            Send Notification
        </button>
    );
};

export default NotificationButton;
