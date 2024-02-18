let prefix = ""
let BDData = {}

let query = ""
let tabela = ""
let fields = {}
let fieldsType = {}

function SetTable(value) {
    tabela = value
    fieldInput.style.display = "none"
    fields = {}
    fieldsType = {}
    if (value != "any") {
        fieldInput.style.display = "block"
        RefreshFields()
        RefreshQuery()
    }
}

function RefreshQuery() {
    document.getElementById("submit").setAttribute("disabled", true)
    query = "INSERT INTO "
    let count = 0
    let data = ""
    if (tabela) {
        query += tabela + "("
        for (const key in fields) {
            if (fields[key] != undefined && fields[key] != "") {
                count += 1
                data += (fieldsType[key] == "varchar" || fieldsType[key] == "char") ? "'" + fields[key] + "'" : fields[key]
                data += ", "
            }
        }
        if (count == Object.keys(fields).length) {
            query += Object.keys(fields).join(", ") + ") VALUES(" + data.substring(0, data.length - 2) + ")"
            document.getElementById("submit").removeAttribute("disabled")
        }
    }
    queryInput.value = query
}

function SetFields(key, value) {
    fields[key] = value
    RefreshQuery()
}

function RefreshFields() {
    let data = ""
    let type = ""
    for (let i = 0; i < BDData[tabela].length; i++) {
        const field = BDData[tabela][i];
        if (!field.increment) {
            type = "type='text'"
            fields[field.name] = undefined
            fieldsType[field.name] = field.type
            if (field.type == "int") {
                type = "type='number'"
            } else if (field.type == "char") {
                type = "type='text' max='1'"
            } else if (field.type == "bool") {
                type = "type='radio'"
            } else if (field.type == "float") {
                type = "type='number'"
            } else if (field.type == "timestamp") {
                type = "type='date'"
            }
            data += `
            <div class="flex flex-row gap-3 h-[30px] w-[30%]">
                <p>` + field.name + `</p>
                <input class="dropdown" onchange="SetFields('` + field.name + `', this.value)" ` + type + `">
            </div>
            `
        }
    }
    document.getElementById("fieldDropdown").innerHTML = data
}

async function ExecuteQuery() {
    let result = await fetch("request.php?query=" + query)
    query = ""
    distinct = false
    orderField = ""
    orderType = "ASC"
    tabela = "any"
    tableDropdown.value = "any"
    fieldInput.style.display = "none"
    conditions = []
    campos = []
    RefreshQuery()
}

async function GetDatabases() {
    BDData = {}
    var result = await fetch("request.php?query=SHOW TABLES")
    var tables = await result.json()
    for (let i = 0; i < tables.length; i++) {
        var result = await fetch("request.php?query=SHOW COLUMNS FROM " + tables[i].Tables_in_freedb_database)
        var fields = await result.json()
        BDData[tables[i].Tables_in_freedb_database] = []
        for (let i2 = 0; i2 < fields.length; i2++) {
            BDData[tables[i].Tables_in_freedb_database].push({
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
    var data2 = "<option value='any'>Nenhum</option>"
    const databases = Object.keys(BDData)
    for (let i = 0; i < databases.length; i++) {
        data2 += "<option value='" + databases[i] + "'>" + databases[i] + "</option>"
    }
    document.getElementById("tableDropdown").innerHTML = data2
}