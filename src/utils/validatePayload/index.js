export const validatePayload = (payload, isUpdate) => {
    const requiredFields = ['title', 'due_date', 'priority', 'status'];
    const createAllowedFields = [...requiredFields, 'description'];

    for (const field of requiredFields) {
        if (!(field in payload)) {
            throw new Error("INVALID_PAYLOAD: Missing required field - " + field);
        }
    }

    // Check if no additional parameters are present in the payload
    for (const field in payload) {
        if (!createAllowedFields.includes(field)) {
            throw new Error("INVALID_PAYLOAD: Additional parameter present - " + field);
        }
    }

    return true;
}