const sistAPI = {

    getVariedadById: function (v) {
        return new Promise(function (resolve, reject) {
            axios
                .get(`/getVariedad?id=${v}`)
                .then(response => resolve(response.data))
                .catch(error => reject(error.response.data.message));
        });
    },

    postDonacion: function(formData, requestOptions){
        return new Promise(function (resolve, reject){
            axios
                .post(`/postDonacion/`, formData, requestOptions)
                .then(response => resolve(response.data))
                .catch(error => reject(error.response.data.message));
        });
    },

    postVariedad: function(formData, requestOptions){
        return new Promise(function (resolve, reject){
            axios
                .post(`/postVariedad/`, formData, requestOptions)
                .then(response => resolve(response.data))
                .catch(error => reject(error.response.data.message));
        });
    },

    updtVariedad: function(id, formData, requestOptions){
        return new Promise(function (resolve, reject){
            axios
                .put(`/postVariedad/?id=${id}`, formData, requestOptions)
                .then(response => resolve(response.data))
                .catch(error => reject(error.response.data.message));
        });
    },

    postDispensacion: function(formData, requestOptions){
        return new Promise(function (resolve, reject){
            axios
                .post(`/postDispensacion/`, formData, requestOptions)
                .then(response => resolve(response.data))
                .catch(error => reject(error.response.data.message));
        });
    },

    getUsers: function(){
        return new Promise(function (resolve, reject) {
            axios
                .get(`/getUsers`)
                .then(response => resolve(response.data))
                .catch(error => reject(error.response.data.message));
        });
    },

    getGroups: function(){
        return new Promise(function (resolve, reject) {
            axios
                .get(`/getGroups/`)
                .then(response => resolve(response.data))
                .catch(error => reject(error.response.data.message));
        });
    },

    getPermissions: function(){
        return new Promise(function (resolve, reject) {
            axios
                .get(`/getPermissions/`)
                .then(response => resolve(response.data))
                .catch(error => reject(error.response.data.message));
        });
    },

    getBebidas: function(id){
        return new Promise(function (resolve, reject) {
            axios
                .get(`/getBebida/?id=${id}`)
                .then(response => resolve(response.data))
                .catch(error => reject(error.response.data.message));
        });
    },

    postUser: function(formData, requestOptions){
        return new Promise(function (resolve, reject){
            axios
                .post(`/addUser/`, formData, requestOptions)
                .then(response => resolve(response.data))
                .catch(error => reject(error.response.data.message));
        });

    },

    postGroup: function(formData, requestOptions){
        return new Promise(function (resolve, reject){
            axios
                .post(`/addGroup/`, formData, requestOptions)
                .then(response => resolve(response.data))
                .catch(error => reject(error.response.data.message));
        });

    },

    postConsumible: function(formData, requestOptions){
        return new Promise(function (resolve, reject){
            axios
                .post(`/postConsumible/`, formData, requestOptions)
                .then(response => resolve(response.data))
                .catch(error => reject(error.response.data.message));
        });

    },

    postBarra: function(formData, requestOptions){
        return new Promise(function (resolve, reject){
            axios
                .post(`/postBarra/`, formData, requestOptions)
                .then(response => resolve(response.data))
                .catch(error => reject(error.response.data.message));
        });

    },

    getGroupUsers: function(group){
        return new Promise(function (resolve, reject) {
            axios
                .get(`/getGroupUsers/?group=${group}`)
                .then(response => resolve(response.data))
                .catch(error => reject(error.response.data.message));
        });
    },

    getGroupPermissions: function(group){
        return new Promise(function (resolve, reject) {
            axios
                .get(`/getGroupPermissions/?group=${group}`)
                .then(response => resolve(response.data))
                .catch(error => reject(error.response.data.message));
        });
    },

    postUser: function(formData, requestOptions){
        return new Promise(function (resolve, reject){
            axios
                .post(`/addUser/`, formData, requestOptions)
                .then(response => resolve(response.data))
                .catch(error => reject(error.response.data.message));
        });

    },

    postUserInGroup: function(formData, requestOptions){
        return new Promise(function (resolve, reject){
            axios
                .post(`/setGroup/`, formData, requestOptions)
                .then(response => resolve(response.data))
                .catch(error => reject(error.response.data.message));
        });
    },

    deleteUserOfGroup: function(formData, requestOptions){
        return new Promise(function (resolve, reject){
            axios
                .post(`/removeGroup/`, formData, requestOptions)
                .then(response => resolve(response.data))
                .catch(error => reject(error.response.data.message));
        });
    },

    deleteUser: function(formData, requestOptions){
        return new Promise(function (resolve, reject){
            axios
                .post(`/deleteUser/`, formData, requestOptions)
                .then(response => resolve(response.data))
                .catch(error => reject(error.response.data.message));
        });
    },

    addPermToGroup: function(formData, requestOptions){
        return new Promise(function (resolve, reject){
            axios
                .post(`/addPermission/`, formData, requestOptions)
                .then(response => resolve(response.data))
                .catch(error => reject(error.response.data.message));
        });
    },

    removePermFromGroup: function(formData, requestOptions){
        return new Promise(function (resolve, reject){
            axios
                .post(`/removePermission/`, formData, requestOptions)
                .then(response => resolve(response.data))
                .catch(error => reject(error.response.data.message));
        });
    },

}

export { sistAPI };