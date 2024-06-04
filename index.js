const express = require("express");
const dotenv = require("dotenv");

const connectToDatabase = require("./src/database/mongoose.database");
const TaskModel = require("./src/models/taks.model"); // Certifique-se de que o caminho e o nome do arquivo estão corretos

dotenv.config();
const app = express();
app.use(express.json());

// Middleware para processar JSON
app.use(express.json());

const startServer = async () => {
    try {
        await connectToDatabase(); // Aguarde a conexão com o banco de dados
        console.log("Connected to database");

        app.get("/tasks", async (req, res) => {
            try {
                const tasks = await TaskModel.find({});
                res.status(200).send(tasks);
            } catch (err) {
                res.status(500).send({
                    message: "Error fetching tasks",
                    error: err,
                });
            }
        });

        app.patch("/tasks/:id", async (req, res) => {
            try {
                const taskId = req.params.id;
                const taskData = req.body;

                const taskToUpdate = await TaskModel.findById(taskId);

                const allowedUpdates = ["isCompleted"];
                const requestedUpdates = Object.keys(taskData);

                for (update of requestedUpdates) {
                    if (allowedUpdates.includes(update)) {
                        taskToUpdate[update] = taskData[update];
                    } else {
                        return res
                            .status(500)
                            .send("Um ou mais campos não são editáveis.");
                    }
                }

                await taskToUpdate.save();
                return res.status(200).send(taskToUpdate);
            } catch (error) {
                return res.status(500).send(error.message);
            }
        });

        app.get("/tasks/:id", async (req, res) => {
            try {
                const taskId = req.params.id;

                const task = await TaskModel.findById(taskId);

                if (!task) {
                    return res
                        .status(404)
                        .send("Essa tarefa não foi encontrada.");
                }

                return res.status(200).send(task);
            } catch (error) {
                res.status(500).send(error.mensage);
            }
        });

        app.post("/tasks", async (req, res) => {
            try {
                const newTask = new TaskModel(req.body);

                await newTask.save();

                res.status(201).send(newTask);
            } catch (error) {
                res.status(500).send(error.mensage);
            }
        });

        app.delete("/tasks/:id", async (req, res) => {
            try {
                const taskId = req.params.id;

                const taksToDelete = await TaskModel.findById(taskId);

                if (!taksToDelete) {
                    return res
                        .status(404)
                        .send("essa tarefa não foi encontrada.");
                }

                const deletedTask = await TaskModel.findByIdAndDelete(taskId);

                res.status(200).send(deletedTask);
            } catch (error) {
                res.status(500).send(error.mensage);
            }
        });

        app.listen(8000, () => {
            console.log("Listening on port 8000!");
        });
    } catch (err) {
        console.error("Failed to connect to database", err);
        process.exit(1);
    }
};
startServer();
