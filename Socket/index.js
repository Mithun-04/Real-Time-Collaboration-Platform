const io = require('socket.io')(4000, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    },
});


const projectUsers = {};

const getUsers = (projectId) => {
    return Array.from(projectUsers[projectId]?.values() || []);
}


io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("joinProject", (projectId, name) => {
        if (!projectUsers[projectId]) {
            projectUsers[projectId] = new Map();
        }
        projectUsers[projectId].set(socket.id, name); // store just the name string

        socket.join(projectId);
        console.log(getUsers(projectId));
        io.to(projectId).emit("onlineUsers", getUsers(projectId));
        console.log(`User (${name}) joined project ${projectId}`);
    });

    socket.on("leaveProject", ({projectId}) => {
        
        socket.leave(projectId);

        if (projectUsers[projectId]?.has(socket.id)) {
            const name = projectUsers[projectId].get(socket.id);
            projectUsers[projectId].delete(socket.id);

            console.log(getUsers(projectId));
            console.log(`User (${name}) left the Project - ${projectId}`);

            io.to(projectId).emit("onlineUsers", getUsers(projectId));

            if (projectUsers[projectId].size === 0) {
                delete projectUsers[projectId];
            }
        }
    });


    socket.on("sendMessage", ({ projectId, message }) => {
        io.to(projectId).emit("receiveMessage", { message });
    })

    socket.on('disconnect', () => {
        console.log("a user Disconnected");
        // Iterate through all projects and remove the user from each
        for (const projectId in projectUsers) {
            if (projectUsers[projectId].has(socket.id)) {
                const name = projectUsers[projectId].get(socket.id);
                projectUsers[projectId].delete(socket.id);

                console.log(getUsers(projectId));
                console.log(`User (${name}) left the Project - ${projectId}`);

                io.to(projectId).emit("onlineUsers", getUsers(projectId));

                if (projectUsers[projectId].size === 0) {
                    delete projectUsers[projectId];
                }
            }
        }
    })
});