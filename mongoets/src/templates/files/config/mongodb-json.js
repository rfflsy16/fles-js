export default (uri, dbName) => `{
    "development": {
        "uri": "${uri}",
        "name": "${dbName}"
    },
    "test": {
        "uri": "${uri}",
        "name": "${dbName}_test"
    },
    "production": {
        "uri": "${uri}",
        "name": "${dbName}_prod"
    }
}` 