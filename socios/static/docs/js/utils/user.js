"use strict"

import {parseHTML} from "/static/docs/js/utils/parseHTML.js";
import {messageRenderer} from "/static/docs/js/renderer/messages.js";
import {sistAPI} from "/static/docs/js/API/sistAPI.js";

document.addEventListener ("DOMContentLoaded", main );

function main(){

    sistAPI.getBebidas(3)
    .then(config => console.log(config))
    .catch(error => messageRenderer.showErrorMessage(error));

    sistAPI.getGroups()
    .then(groups => {
        let g = JSON.parse(groups);
        sistAPI.getUsers()
        .then(users => {
            let u = JSON.parse(users);
            userGroupsRenderer(u, g, 0);
        })
        .catch(error => messageRenderer.showErrorMessage(error));
    })
    .catch(error => messageRenderer.showErrorMessage(error));

    sistAPI.getGroups()
    .then(groups => {
        let g = JSON.parse(groups);
        sistAPI.getPermissions()
        .then(perms => {
            let p = JSON.parse(perms);
            groupPermissionsRenderer(p, g, 0);
        })
        .catch(error => messageRenderer.showErrorMessage(error));
    })
    .catch(error => messageRenderer.showErrorMessage(error));

    $("#btnCloseUserForm").click(function(){
        document.getElementById("showUserForm").disabled = false;
        document.getElementById("showGroupForm").disabled = false;
        let userFormContainer=$("#userFormContainer")[0];
        let shadowBg=$("#shadowBg")[0];
        userFormContainer.classList.add("d-none");
        shadowBg.classList.add("d-none");
    });

    $("#showUserForm").click(function(){
        document.getElementById("showUserForm").disabled = true;
        document.getElementById("showGroupForm").disabled = true;
        let userFormContainer=$("#userFormContainer")[0];
        let shadowBg=$("#shadowBg")[0];
        userFormContainer.classList.remove("d-none");
        shadowBg.classList.remove("d-none");
    })

    let userForm = document.getElementById ("userForm") ;
    userForm.onsubmit = handleUserPost;

    $("#btnCloseGroupForm").click(function(){
        document.getElementById("showUserForm").disabled = false;
        document.getElementById("showGroupForm").disabled = false;
        let groupFormContainer=$("#groupFormContainer")[0];
        let shadowBg=$("#shadowBg")[0];
        groupFormContainer.classList.add("d-none");
        shadowBg.classList.add("d-none");
    });

    $("#showGroupForm").click(function(){
        document.getElementById("showUserForm").disabled = true;
        document.getElementById("showGroupForm").disabled = true;
        let groupFormContainer=$("#groupFormContainer")[0];
        let shadowBg=$("#shadowBg")[0];
        groupFormContainer.classList.remove("d-none");
        shadowBg.classList.remove("d-none");
    });

    let groupForm = document.getElementById("groupForm") ;
    groupForm.onsubmit = handleGroupPost;

}

function userGroupsRenderer(listUsers, listGroups, i){

    let tabBtn = `<button class="nav-link text-start" id="v-pills-${listGroups[i].name.replaceAll(" ","-")}-tab" data-bs-toggle="pill" data-bs-target="#v-pills-${listGroups[i].name.replaceAll(" ","-")}" 
                type="button" role="tab" aria-controls="v-pills-home" aria-selected="true">${listGroups[i].name.replaceAll(" ","-")}</button>`;
    
    document.getElementById("v-pills-tab").appendChild(parseHTML(tabBtn));

    let tab = `<div class="tab-pane fade" id="v-pills-${listGroups[i].name.replaceAll(" ","-")}" role="tabpanel">
                <ul class="list-group m-2" id="list-users-${listGroups[i].name.replaceAll(" ","-")}"></ul></div>`;

    let vPills = document.getElementById("v-pills-tabContent");
    vPills.appendChild(parseHTML(tab));

    sistAPI.getGroupUsers(listGroups[i].name.replaceAll(" ", "%20"))
    .then(users => {
        let gUsers = JSON.parse(users);
        let j = 0;
        while(j<listUsers.length){
            let usernameee = `${listUsers[j].username}`;
            let grooup = `${listGroups[i].name}`;
            if(gUsers.filter(u => (u.username === listUsers[j].username))[0] !== undefined){
                let checked = `<li class="list-group-item">
                                    <input class="form-check-input me-1" id="${listGroups[i].name.replaceAll(" ","-")}-${listUsers[j].username}" type="checkbox" checked>
                                        ${listUsers[j].username}
                                    <button type="button" id="delete-${listGroups[i].name.replaceAll(" ","-")}-${listUsers[j].username}" class="btn btn-link" onclick="" style="color: brown; float: right;"><i class="fa fa-trash-o" aria-hidden="true"></i></button>
                                </li>`;

                document.getElementById(`list-users-${listGroups[i].name.replaceAll(" ","-")}`).appendChild(parseHTML(checked));


            }else{
                let unchecked = `<li class="list-group-item">
                                    <input class="form-check-input me-1" id="${listGroups[i].name.replaceAll(" ","-")}-${listUsers[j].username}" type="checkbox">
                                        ${listUsers[j].username}
                                    <button type="button" id="delete-${listGroups[i].name.replaceAll(" ","-")}-${listUsers[j].username}" class="btn btn-link" onclick="" style="color: brown; float: right;"><i class="fa fa-trash-o" aria-hidden="true"></i></button>
                                </li>`;

                document.getElementById(`list-users-${listGroups[i].name.replaceAll(" ","-")}`).appendChild(parseHTML(unchecked));

            }

            $(`#${listGroups[i].name.replaceAll(" ","-")}-${listUsers[j].username}`).change(function(){
                const csrftoken = getCookie('csrftoken')

                let requestOptions = {
                    headers: {
                        'X-CSRFToken': csrftoken
                    }
                };
                let formData = new FormData();
                formData.append("username", `${usernameee}`);
                formData.append("group", `${grooup}`);

                if(this.checked) {

                    sistAPI.postUserInGroup(formData, requestOptions)
                        .then()
                        .catch(error => messageRenderer.showErrorMessage(error));

                }else{

                    sistAPI.deleteUserOfGroup(formData, requestOptions)
                        .then()
                        .catch(error => messageRenderer.showErrorMessage(error));

                }
            })

            $(`#delete-${listGroups[i].name.replaceAll(" ","-")}-${listUsers[j].username}`).click(function(){
                const csrftoken = getCookie('csrftoken')

                let requestOptions = {
                    headers: {
                        'X-CSRFToken': csrftoken
                    }
                };
                let formData = new FormData();
                formData.append("username", `${usernameee}`);

                sistAPI.deleteUser(formData, requestOptions)
                //render
                    .then()
                    .catch(error => messageRenderer.showErrorMessage(error));

            })


            j+=1;
        }

        if(i<listGroups.length-1){
            userGroupsRenderer(listUsers, listGroups, i+1);
        }

    })
    .catch(error => messageRenderer.showErrorMessage(error));


}

function groupPermissionsRenderer(listPerms, listGroups, i){

    let tabBtn = `<button class="nav-link text-start" id="v-pills-${listGroups[i].name.replaceAll(" ","-")}-tab2" data-bs-toggle="pill" data-bs-target="#v-pills-${listGroups[i].name.replaceAll(" ","-")}2" 
                type="button" role="tab" aria-controls="v-pills-home" aria-selected="true">${listGroups[i].name.replaceAll(" ","-")}</button>`;
    
    document.getElementById("v-pills-tab2").appendChild(parseHTML(tabBtn));

    let tab = `<div class="tab-pane fade" id="v-pills-${listGroups[i].name.replaceAll(" ","-")}2" role="tabpanel">
                <ul class="list-group m-2" id="list-perms-${listGroups[i].name.replaceAll(" ","-")}"></ul></div>`;

    let vPills = document.getElementById("v-pills-tabContent2");
    vPills.appendChild(parseHTML(tab));

    sistAPI.getGroupPermissions(listGroups[i].name.replaceAll(" ", "%20"))
    .then(perm => {
        let perms = JSON.parse(perm);
        let j = 0;
        while(j<listPerms.length){
            let permission = `${listPerms[j].name}`;
            let grooup = `${listGroups[i].name}`;
            if(perms.filter(p => (p.name === listPerms[j].name))[0] !== undefined){
                let checked = `<li class="list-group-item">
                                    <input class="form-check-input me-1" id="${listGroups[i].name.replaceAll(" ","-")}${listPerms[j].nombre.replaceAll(" ","-").replaceAll("(s)","")}" type="checkbox" checked>
                                        ${listPerms[j].nombre}
                                </li>`;

                document.getElementById(`list-perms-${listGroups[i].name.replaceAll(" ","-").replaceAll("(s)","")}`).appendChild(parseHTML(checked));


            }else{
                let unchecked = `<li class="list-group-item">
                                    <input class="form-check-input me-1" id="${listGroups[i].name.replaceAll(" ","-")}${listPerms[j].nombre.replaceAll(" ","-")}" type="checkbox">
                                        ${listPerms[j].nombre}
                                </li>`;

                document.getElementById(`list-perms-${listGroups[i].name.replaceAll(" ","-")}`).appendChild(parseHTML(unchecked));

            }

            $(`#${listGroups[i].name.replaceAll(" ","-")}${listPerms[j].nombre.replaceAll(" ","-").replaceAll("(s)","")}`).change(function(){
                const csrftoken = getCookie('csrftoken')

                let requestOptions = {
                    headers: {
                        'X-CSRFToken': csrftoken
                    }
                };
                let formData = new FormData();
                formData.append("permission", `${permission}`);
                formData.append("group", `${grooup}`);

                if(this.checked) {

                    sistAPI.addPermToGroup(formData, requestOptions)
                        .then()
                        .catch(error => messageRenderer.showErrorMessage(error));

                }else{

                    sistAPI.removePermFromGroup(formData, requestOptions)
                        .then()
                        .catch(error => messageRenderer.showErrorMessage(error));

                }
            })

            j+=1;
        }

        if(i<listGroups.length-1){
            groupPermissionsRenderer(listPerms, listGroups, i+1);
        }

    })
    .catch(error => messageRenderer.showErrorMessage(error));


}

function handleUserPost(event){

    event.preventDefault();

    const csrftoken = getCookie('csrftoken')

    let requestOptions = {
        headers: {
            'X-CSRFToken': csrftoken
        }
    };

    let form = event.target;
    let formData = new FormData(form);
    sistAPI.postUser(formData, requestOptions)
        .then(data => {
            document.getElementById("showUserForm").disabled = false;
            document.getElementById("showGroupForm").disabled = false;
            let userFormContainer=$("#userFormContainer")[0];
            let shadowBg=$("#shadowBg")[0];
            userFormContainer.classList.add("d-none");
            shadowBg.classList.add("d-none");
            document.getElementById("v-pills-tab").innerHTML = "";
            document.getElementById("v-pills-tabContent").innerHTML = "";
            sistAPI.getGroups()
            .then(groups => {
                let g = JSON.parse(groups);
                sistAPI.getUsers()
                .then(users => {
                    let u = JSON.parse(users);
                    userGroupsRenderer(u, g, 0);
                })
                .catch(error => messageRenderer.showErrorMessage(error));
            })
            .catch(error => messageRenderer.showErrorMessage(error));

        }) 
        .catch (error => messageRenderer.showErrorMessage(error));
}

function handleGroupPost(event){

    event.preventDefault();

    const csrftoken = getCookie('csrftoken')

    let requestOptions = {
        headers: {
            'X-CSRFToken': csrftoken
        }
    };

    let form = event.target;
    let formData = new FormData(form);
    sistAPI.postGroup(formData, requestOptions)
        .then(data => {
            document.getElementById("showUserForm").disabled = false;
            document.getElementById("showGroupForm").disabled = false;
            let groupFormContainer=$("#groupFormContainer")[0];
            let shadowBg=$("#shadowBg")[0];
            groupFormContainer.classList.add("d-none");
            shadowBg.classList.add("d-none");
            document.getElementById("v-pills-tab").innerHTML = "";
            document.getElementById("vv-pills-tabContent").innerHTML = "";
            sistAPI.getGroups()
            .then(groups => {
                let g = JSON.parse(groups);
                sistAPI.getPermissions()
                .then(perms => {
                    let p = JSON.parse(perms);
                    groupPermissionsRenderer(p, g, 0);
                })
                .catch(error => messageRenderer.showErrorMessage(error));
            })
            .catch(error => messageRenderer.showErrorMessage(error));
        }) 
        .catch (error => messageRenderer.showErrorMessage(error));
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}