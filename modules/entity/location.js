const { EntitySchema } = require("typeorm");

exports.Location = new EntitySchema({
    name: "Location",
    tableName: "locations",
    schema: "imagemanager",
    columns: {
        id: {
            name: "id",
            type: "uuid",
            generated: "uuid",
            primary: true,
        },
        createdAt: {
            name: "created_at",
            type: "timestamp",
            createDate: true,
        },
        updatedAt: {
            name: "updated_at",
            type: "timestamp",
            updateDate: true,
        },
        deletedAt: {
            name: "deleted_at",
            type: "timestamp",
            nullable: true,
        },
        isDeleted: {
            name: "is_deleted",
            type: "boolean",
            default: false,
        },
        name: {
            name: "name",
            type: "varchar",
            length: 1024,
            nullable: false,
            unique: true,
        },
        xCoordinate: {
            name: "x_coordinate",
            type: "int",
            nullable: false,
        },
        yCoordinate: {
            name: "y_coordinate",
            type: "int",
            nullable: false,
        },
    },
    relations: {
        images: {
            target: "Image",
            type: "one-to-many",
            joinTable: true,
        },
    },
    indices: [
        {
            columns: ["name", "xCoordinate", "yCoordinate"],
            unique: true,
        },
        {
            columns: ["xCoordinate", "yCoordinate"],
            unique: true,
        },
        {
            columns: ["isDeleted"],
        },
        {
            columns: ["name"],
        },
    ],
});

exports.validateCoordinates = (...coordinates) => {
    for (var coordinate of coordinates) {
        if (coordinate < -10000 || coordinate > 10000) {
            return false;
        }
    }
    return true;
};
