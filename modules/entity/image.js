const { EntitySchema } = require("typeorm");

exports.Image = new EntitySchema({
    name: "Image",
    tableName: "images",
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
        fileName: {
            name: "filename",
            type: "text",
            nullable: false,
        },
    },
    relations: {
        location: {
            target: "Location",
            type: "many-to-one",
            joinTable: true,
            joinColumn: {
                name: "location_id",
            },
        },
    },
    indices: [
        {
            columns: ["fileName"],
            unique: true,
        },
        {
            columns: ["isDeleted"],
        },
    ],
});
