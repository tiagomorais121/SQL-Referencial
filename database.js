let query = ""
let action = ""
let database = ""

let prefix = ""

let BDs = {}

function setAction(value) {
    action = value
    const nameInput = document.getElementById("nameInput")
    const databaseInput = document.getElementById("databaseInput")
    nameInput.style.display = "none"
    databaseInput.style.display = "none"
    query = ""
    if (value == "create") {
        nameInput.style.display = "block"
        query = "CREATE DATABASE"
    } else if (value == "delete") {
        const databases = Object.keys(BDs)
        const databaseDropdown = document.getElementById("databaseDropdown")
        let data = "<option value='any'>Nenhum</option>"
        databaseDropdown.innerHTML = ""
        for (let i = 0; i < databases.length; i++) {
            const database = databases[i];
            data += "<option value='" + database + "'>" + database + "</option>"
        }
        databaseDropdown.innerHTML = data
        databaseInput.style.display = "block"
        query = "DROP DATABASE"
    }
    RefreshQuery()
}

async function ExecuteQuery() {
    if (action == "create") {
        BDs[database] = {}
    } else if (action == "delete") {
        delete BDs[database]
    }
    fetch("request.php?query=" + query + " " + prefix + database + "")
    document.getElementById("actionDropdown").value = "any"
    document.getElementById("submit").setAttribute("disabled", true)
    query = ""
    action = ""
    database = ""
    setAction()
    RefreshQuery()
    RefreshBDs()
}

GetDatabases()

async function GetDatabases() {
    var result = await fetch("request.php?query=SHOW DATABASES")
    var databases = await result.text()
    databases = JSON.parse(databases.replace("SHOW DATABASES", ""))
    databases = databases.filter((database) => database.Database != "information_schema" && database.Database != "performance_schema")
    for (let i = 0; i < databases.length; i++) {
        BDs[databases[i].Database.replace(prefix, "")] = []
    }
    RefreshBDs()
}

function ChangeDataBaseName(name) {
    database = name
    if (action == "create") {
        if (!BDs[name] && name != undefined && name != "") {
            document.getElementById("submit").removeAttribute("disabled")
        } else {
            document.getElementById("submit").setAttribute("disabled", true)
        }
    }
    RefreshQuery()
}

function RefreshQuery() {
    queryInput.value = query + " " + database
}

function RefreshBDs() {
    var data = ""
    const databases = Object.keys(BDs)
    for (let i = 0; i < databases.length; i++) {
        const database = databases[i];
        data += `
            <div class="bd">
                <h1 class="my-3 ml-3">` + database + `</h1>
                <div id="tabelasBody" class="p-5 flex gap-5 justify-center items-center flex-wrap overflow-auto">`
                for (let i2 = 0; i2 < BDs[database].length; i2++) {
                    const tabela = BDs[database][i2];
                    data += `
                    <div class="tabela flex-none">
                        <p class="text-center my-3">` + tabela + `</p>
                        <div class="w-full flex justify-center">
                            <div class="w-[75%] h-[1px] bg-neutral-700"></div>
                        </div>
                    </div>
                    `   
                }
        data += `
                </div>
            </div>
        `
    }
    document.getElementById("bdBody").innerHTML = data
}