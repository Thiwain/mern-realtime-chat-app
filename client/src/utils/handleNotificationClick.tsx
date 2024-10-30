export const handleNotificationClick = (txtMsg:string) => {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        } else if (Notification.permission === "granted") {
            showNotification(txtMsg);
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    showNotification(txtMsg);
                } else {
                    alert("Notification permissions were denied.");
                }
            }).catch(error => {
                console.error("Permission request failed:", error);
            });
        }
    };

    const showNotification = (txt:string) => {
        const notification = new Notification("Hello!", {
            body: txt,
            icon: "client/public/notification.png"
        });

        notification.onclick = () => {
            window.focus();
        };
    };



