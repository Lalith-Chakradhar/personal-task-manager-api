const TaskModel = (sequelize, DataTypes) => {

    const Task = sequelize.define(
        'Task',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: DataTypes.TEXT,
            priority: {
                type: DataTypes.ENUM('low', 'medium', 'high'),
                allowNull: false,
            },
            dueDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('pending', 'completed'),
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
        },
        {
            tableName: 'Tasks',
            timestamps: true,
            paranoid: true,
        }
    );

    return Task;
    
};


export default TaskModel;