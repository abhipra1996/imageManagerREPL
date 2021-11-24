const { generateResponseObject } = require("../response");
const { Image } = require("../entity/image");
const { getConnection, getRepository } = require("typeorm");
const { extractCreateObject } = require("../util");

const VALID_IMAGE_LIMIT = 1000000;

const validateImageLimit = async () => {
    try {
        let imageListCount = await getRepository(Image).count({
            where: {
                isDeleted: false,
            },
        });
        let success = true;
        let errorDesc = "";
        if (imageListCount < VALID_IMAGE_LIMIT) {
            success = true;
        } else {
            success = false;
            errorDesc = "Max Number Of Images Reached";
        }
        return generateResponseObject(success, imageListCount, errorDesc);
    } catch (error) {
        return generateResponseObject(false, {}, error.toString());
    }
};

exports.getImageByFileName = async (db, fileName) => {
    try {
        const imageObj = await db
            .getRepository(Image)
            .createQueryBuilder("images")
            .where(
                "images.filename = :fileName AND images.is_deleted = :isDeleted",
                {
                    fileName: fileName,
                    isDeleted: false,
                }
            )
            .getOne();
        if (imageObj === undefined) {
            return generateResponseObject(false, {}, "Image Does Not Exists");
        } else {
            return generateResponseObject(true, imageObj, "");
        }
    } catch (error) {
        return await generateResponseObject(false, {}, error.toString());
    }
};

exports.removeImageByFileName = async (fileName) => {
    try {
        let updateImageResponse = await getConnection()
            .createQueryBuilder()
            .update(Image)
            .set({ isDeleted: true, deletedAt: new Date() })
            .where("filename = :fileName", {
                fileName: fileName,
            })
            .execute();
        return generateResponseObject(true, updateImageResponse, "");
    } catch (error) {
        return generateResponseObject(false, {}, error.toString());
    }
};

exports.getAllImagesByParams = async (db, queryParams) => {
    try {
        let imageList = await db.getRepository(Image).find(queryParams);
        return generateResponseObject(true, imageList, "");
    } catch (error) {
        return generateResponseObject(false, {}, error.toString());
    }
};

exports.createImage = async (fileName, locationID) => {
    try {
        let canCreateImageResponse = await validateImageLimit();
        if (canCreateImageResponse.success) {
            let image = await getConnection()
                .createQueryBuilder()
                .insert()
                .into(Image)
                .values({
                    fileName: fileName,
                    location: locationID,
                })
                .execute();
            return generateResponseObject(true, extractCreateObject(image), "");
        } else {
            return generateResponseObject(
                canCreateImageResponse.success,
                {},
                canCreateImageResponse.errorDesc
            );
        }
    } catch (error) {
        return generateResponseObject(false, {}, error.toString());
    }
};
