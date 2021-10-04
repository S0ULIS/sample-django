//const BASE_URL = "/api/v1";

const socioAPI = {
    getById: function (user) {
        return new Promise(function (resolve, reject) {
            axios
                .get(`/getSocio?nSocio=${user}`)
                .then(response => resolve(response.data))
                .catch(error => reject(error.response.data.message));
        });
    },

    postSocio: function (formData, requestOptions){
        return new Promise(function (resolve, reject){
            axios
                .post(`/postSocio/`, formData, requestOptions)
                .then(response => resolve(response.data))
                .catch(error => reject(error.response.data.message));
        });
    },

    updtSocio: function (formData, requestOptions){
        return new Promise(function (resolve, reject){
            axios
                .put(`/postSocio/`, formData, requestOptions)
                .then(response => resolve(response.data))
                .catch(error => reject(error.response.data.message));
        });
    },

    getHistorial: function (user,requestOptions) {
        return new Promise(function (resolve, reject) {
            axios
                .get(`/getHistorial?nSocio=${user}`)
                .then(response => resolve(response.data))
                .catch(error => reject(error.response.data.message));
        });
    }
}

export { socioAPI };