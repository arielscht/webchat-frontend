const updateObject = (oldObject, updatedItems) => {
    const newObject = Object.assign({}, oldObject);
    return Object.assign(newObject, updatedItems);
}

export default updateObject;