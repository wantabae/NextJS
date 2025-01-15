-- CreateTable
CREATE TABLE "Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "dueDate" DATETIME,
    "dueTime" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false
);
