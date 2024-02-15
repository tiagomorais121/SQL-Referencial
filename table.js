let prefix = "12itm10_"
let BDData = {}
let OldBDData = {}
let RemovedData = {}
let RemovedData2 = {}

let table = ""
let tableName = ""

let action = ""
let query = ""

function AddData() {
    BDData[table].push({
        name: "",
        type: "int",
        size: "",
        constraints: "",
        increment: false,
        default: "",
    })
    RefreshData()
}

function copy(aObject) {
    let bObject = Array.isArray(aObject) ? [] : {};
    let value;
    for (const key in aObject) {
        value = aObject[key];
        bObject[key] = (typeof value === "object") ? copy(value) : value;
    }
    return bObject;
}

function SetAction(value) {
    action = value
    table = ""
    let nameInput = document.getElementById("nameInput")
    let dataInput = document.getElementById("dataInput")
    let tableSelect = document.getElementById("tableSelect")
    nameInput.style.display = "none"
    dataInput.style.display = "none"
    tableSelect.style.display = "none"
    delete BDData["new"]
    if (value == "create") {
        table = "new"
        BDData[table] = []
        nameInput.style.display = "block"
        dataInput.style.display = "block"
    } else if (value == "delete") {
        RefreshTables()
        tableSelect.style.display = "block"
    } else if (value == "update") {
        RemovedData = {}
        OldBDData = copy(BDData)
        RefreshTables()
        tableSelect.style.display = "block"
    }
    RefreshData()
    RefreshQuery()
}

function GetDifferences(data1, data2, isReturned = false) {
    let Differences = {}
    for (let i = 0; i < data1.length; i++) {
        let keys = Object.keys(data1[i])
        for (let i2 = 0; i2 < keys.length; i2++) {
            if (data2[i]) {
                if (!isReturned) {
                    if (data1[i][keys[i2]] != data2[i][keys[i2]]) {
                        if (!Differences[data1[i]["name"]]) Differences[data1[i]["name"]] = {}
                        Differences[data1[i]["name"]][keys[i2]] = data2[i][keys[i2]]
                    }
                }
            } else {
                if (!RemovedData[data1[i]["name"]]) {
                    if (!Differences[data1[i]["name"]]) Differences[data1[i]["name"]] = {}
                    Differences[data1[i]["name"]][keys[i2]] = data1[i][keys[i2]]
                }
            }
        }
    }
    if (isReturned) {
        return Differences
    } else {
        return {
            Removed: Differences,
            Add: GetDifferences(data2, data1, true)
        }
    }
}

function RefreshQuery() {
    query = ""
    if (action == "create") {
        query = `
        CREATE TABLE ` + tableName + ` (`
        for (let i = 0; i < BDData[table].length - 1; i++) {
            const field = BDData[table][i];
            query += field.name + " " + field.type + "(" + field.size + ")" + " " + field.constraints + (field.default != "" || field.increment ? (field.increment ? " AUTO_INCREMENT" : " DEFAULT '" + field.default + "'") : "") + ", "
        }
        const field = BDData[table][BDData[table].length - 1];
        if (field) query += field.name + " " + field.type + "(" + field.size + ")" + " " + field.constraints + (field.default != "" || field.increment ? (field.increment ? " AUTO_INCREMENT" : " DEFAULT '" + field.default + "'") : "")
        query += `);`
    } else if (action == "delete") {
        query = "DROP TABLE " + table
    } else if (action == "update") {
        query = "ALTER TABLE " + table
        if (OldBDData[table]) {
            let { Removed, Add } = GetDifferences(OldBDData[table], BDData[table])
            for (const field in Removed) {
                const fieldName = Removed[field]["name"] ?? field
                let alreadyExecuted = false
                for (const column in Removed[field]) {
                    if (column == "name") {
                        query += " RENAME COLUMN " + field + " to " + Removed[field][column] + ","
                    } else if (column == "type" || column == "size") {
                        if (!alreadyExecuted) {
                            alreadyExecuted = true
                            const originalData = BDData[table].filter((fields) => fields.name == field)[0]
                            const size = Removed[field]["size"] ?? (originalData.size ?? 10)
                            const type = Removed[field]["type"] ?? originalData.type
                            query += " ALTER COLUMN " + fieldName + " " + type + "(" + size + "),"
                        }
                    }
                }
            }
            for (const field in RemovedData) {
                query += " DROP COLUMN " + field + ","
                const data = BDData[table].filter((fields) => fields.name == field)
                if (data.length > 0) {
                    Add[field] = data[0]
                }
            }
            for (const dataField in Add) {
                const field = Add[dataField]
                query += " ADD " + field.name + " " + field.type + "(" + field.size + ")" + " " + field.constraints + (field.default != "" || field.increment ? (field.increment ? " AUTO_INCREMENT" : " DEFAULT '" + field.default + "'") : "") + ", "
            }
            query = query.substring(0, query.length - 2) + ";"
        }
    }
    queryInput.value = query
}

function VerifyFields() {
    let error = false
    if (action == "create") error = nameText.value == ""
    if (BDData[table]) {
        for (let i = 0; i < BDData[table].length; i++) {
            const fields = BDData[table][i]
            if (fields.name == "" || fields.size == "") error = true
        }
    }
    if (error) {
        document.getElementById("submit").setAttribute("disabled", true)
    } else {
        document.getElementById("submit").removeAttribute("disabled")
    }
}

function RefreshTables() {
    let data = '<option value="any">Nenhum</option>'
    let tables = Object.keys(BDData)
    for (let i = 0; i < tables.length; i++) {
        data += '<option value="' + tables[i] + '">' + tables[i] + '</option>'
    }
    tableDropdown.innerHTML = data
}

function ChangeName(value) {
    tableName = value
    RefreshQuery()
    VerifyFields()
}

function SetTable(value) {
    table = value
    tableName = value
    let dataInput = document.getElementById("dataInput")
    if (action == "update" && value != "any") {
        dataInput.style.display = "block"
        RefreshData()
    } else {
        dataInput.style.display = "none"
    }
    RefreshQuery()
    VerifyFields()
}

function SetData(index, value, key) {
    BDData[table][index][key] = value
    if (BDData[table][index]["constraints"] == "PRIMARY KEY" && BDData[table][index]["type"] == "int") {
        document.getElementById("increment" + index).style.display = "block"
    } else {
        document.getElementById("increment" + index).style.display = "none"
    }
    RefreshQuery()
    VerifyFields()
}

function RemoveData(index) {
    if (BDData[table][index]["name"] != "") {
        RemovedData[BDData[table][index]["name"]] = true
        OldBDData[table].splice(index, 1);
        BDData[table].splice(index, 1);
        RefreshQuery()
        RefreshData()
    }
}

async function ExecuteQuery() {
    let result = await fetch("request.php?query=" + query)
    actionDropdown.value = "any"
    table = ""
    tableName = ""
    action = ""
    query = ""
    RefreshQuery()
    GetDatabases()
    SetAction()
}

function RefreshData() {
    if (BDData[table]) {
        VerifyFields()
        let data = ""
        for (let i = 0; i < BDData[table].length; i++) {
            const field = BDData[table][i]
            data += `
                <div class="flex flex-row gap-3">
                    <input class="dropdown" oninput="SetData(` + i + `, this.value, 'name')" type="text" placeholder="Nome" value='` + field.name + `'>
                    <select ` + (action == "update" ? (field.constraints == "PRIMARY KEY" ? "disabled" : "") : "") + ` class="dropdown" onchange="SetData(` + i + `, this.value, 'type')">
                        <option ` + (field.type == "int" ? "selected" : "") + ` value="int">INT</option>
                        <option ` + (field.type == "varchar" ? "selected" : "") + ` value="varchar">VARCHAR</option>
                        <option ` + (field.type == "char" ? "selected" : "") + ` value="char">Char</option>
                        <option ` + (field.type == "bool" ? "selected" : "") + ` value="bool">BOOL</option>
                        <option ` + (field.type == "float" ? "selected" : "") + ` value="float">Float</option>
                        <option ` + (field.type == "timestamp" ? "selected" : "") + ` value="timestamp">Timestamp</option>
                    </select>
                    <input class="dropdown" oninput="SetData(` + i + `, this.value, 'size')" type="text" value='` + field.size + `' placeholder="Tamanho">
                    <select ` + (action == "update" ? "disabled" : "") + ` class="dropdown" onchange="SetData(` + i + `, this.value, 'constraints')">
                        <option ` + (field.constraints == "DEFAULT" ? "selected" : "") + ` value="DEFAULT">Padrão</option>
                        <option ` + (field.constraints == "PRIMARY KEY" ? "selected" : "") + ` value="PRIMARY KEY">Chave Primária</option>
                        <option ` + (field.constraints == "NOT NULL" ? "selected" : "") + ` value="NOT NULL">NOT NULL</option>
                        <option ` + (field.constraints == "UNIQUE" ? "selected" : "") + ` value="UNIQUE">Unico</option>
                    </select>
                    <div id="increment` + i + `" class="dropdown flex items-center gap-1 hidden">
                        <input type="checkbox" oninput="SetData(` + i + `, this.checked, 'increment')" ` + (field.increment ? "checked" : "") + `>
                        <label>Increment</label>
                    </div>
                    <input class="dropdown" oninput="SetData(` + i + `, this.value, 'default')" type="text" value='` + field.default + `' placeholder="Predefinição">
                    <div class="w-[200px] flex justify-center items-center button cardTemplate" onclick="RemoveData(` + i + `)">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="1.2"></g><g id="SVGRepo_iconCarrier"> <path d="M6 12L18 12" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                    </div>
                </div>
            `
        }
        dataFields.innerHTML = data

    }
}

async function GetDatabases() {
    BDData = {}
    var result = await fetch("request.php?query=SHOW TABLES")
    var tables = await result.json()
    for (let i = 0; i < tables.length; i++) {
        var result = await fetch("request.php?query=SHOW COLUMNS FROM " + tables[i].Tables_in_12itm10_database)
        var fields = await result.json()
        BDData[tables[i].Tables_in_12itm10_database] = []
        for (let i2 = 0; i2 < fields.length; i2++) {
            BDData[tables[i].Tables_in_12itm10_database].push({
                name: fields[i2].Field,
                type: ((fields[i2].Type).indexOf("(") != -1 ? (fields[i2].Type).substring(0, (fields[i2].Type).indexOf("(")) : (fields[i2].Type)),
                size: ((fields[i2].Type).indexOf("(") != -1 ? (fields[i2].Type).substring((fields[i2].Type).indexOf("(") + 1, (fields[i2].Type).indexOf(")")) : "10"),
                constraints: fields[i2].Key == "PRI" ? "PRIMARY KEY" : fields[i2].Key,
                increment: fields[i2].Extra == "auto_increment",
                default: fields[i2].Default,
            })
        }
    }
    RefreshBDs()
}
GetDatabases()

function RefreshBDs() {
    var data = ""
    const databases = Object.keys(BDData)
    data += `
            <div class="bd">
                <h1 class="my-3 ml-3">Base de Dados</h1>
                <div id="tabelasBody" class="p-5 flex gap-5 justify-center items-center flex-wrap overflow-auto">`
    for (let i = 0; i < databases.length; i++) {
        const tabela = databases[i];
        data += `<div class="tabela flex-none">
                                    <p class="text-center my-3">` + tabela + `</p>
                                    <div class="w-full flex flex-col gap-3 justify-center">
                                        <div class="flex justify-center"><div class="w-[75%] h-[1px] bg-neutral-700"></div></div>`
        for (let i2 = 0; i2 < BDData[tabela].length; i2++) {
            const field = BDData[tabela][i2];
            data += `
                                                <p class="text-center">` + field.name + " " + field.type + "(" + field.size + ")" + `</p>`
        }
        data += `
                                    </div>
                                </div>`
    }
    data += ` </div>
            </div>`
    document.getElementById("bdBody").innerHTML = data
}