let prefix = ""
let BDData = {}

let query = ""
let queryResult = []

let tabela = ""
let lastTabela = ""
let distinct = false
let campos = []
let orderField = ""
let orderType = "ASC"
let conditions = []

function SetTable(value) {
    tabela = value
    fieldInput.style.display = "none"
    whereInput.style.display = "none"
    orderInput.style.display = "none"
    conditions = []
    document.getElementById("whereDropdown").innerHTML = ""
    if (value != "any") {
        fieldInput.style.display = "block"
        RefreshFields()
        RefreshQuery()
    } else {
        campos = []
    }
}

function SetDistinct(value) {
    distinct = value
    RefreshQuery()
}

function SetFields(element) {
    whereInput.style.display = "none"
    orderInput.style.display = "none"
    orderField = ""
    if (element.checked) {
        campos.push(element.value)
    } else {
        campos = campos.filter((elemento) => elemento != element.value)
    }
    if (campos.length > 0) {
        whereInput.style.display = "block"
        orderInput.style.display = "block"
    }
    RefreshIfFields()
    RefreshOrderFields()
    RefreshQuery()
}

function SetOrderField(value) {
    orderField = value
    RefreshQuery()
}

function SetOrderType(value) {
    orderType = value
    RefreshQuery()
}

function AddField() {
    const value = document.getElementById("fieldsDropdown").value
    if (value != "any") {
        conditions.push({
            name: value,
            function: "any",
            type: "any",
            value1: "",
            value2: ""
        })
        document.getElementById("fieldsDropdown").value = "any"
        RefreshConditions()
    }
}

function SetConditionField(index, key, value) {
    conditions[index][key] = value
    if (key == "type") RefreshConditions()
    RefreshQuery()
}

function RemoveCondition(index) {
    conditions.splice(index, 1);
    RefreshConditions()
    RefreshQuery()
}

function RefreshConditions() {
    let data = ""
    for (let i = 0; i < conditions.length; i++) {
        data += `
        <div class="flex flex-row space-x-2 h-[30px]">
            <input class="dropdown" disabled value="` + conditions[i].name + `">
            <select class="dropdown w-[300px]" onchange="SetConditionField(`+ i + `, 'function', this.value)">
                <option ` + (conditions[i].function == "any" ? "selected" : "") + ` value="any">Nenhum</option>
                <option ` + (conditions[i].function == "MIN" ? "selected" : "") + ` value="MIN">MIN</option>
                <option ` + (conditions[i].function == "MAX" ? "selected" : "") + ` value="MAX">MAX</option>
                <option ` + (conditions[i].function == "COUNT" ? "selected" : "") + ` value="COUNT">COUNT</option>
                <option ` + (conditions[i].function == "SUM" ? "selected" : "") + ` value="SUM">SUM</option>
                <option ` + (conditions[i].function == "AVG" ? "selected" : "") + ` value="AVG">AVG</option>
            </select>
            <select class="dropdown w-[300px]" onchange="SetConditionField(`+ i + `, 'type', this.value)" value="` + conditions[i].type + `">
                <option ` + (conditions[i].type == "any" ? "selected" : "") + ` value="any">Nenhum</option>
                <option ` + (conditions[i].type == "=" ? "selected" : "") + ` value="=">Igual</option>
                <option ` + (conditions[i].type == "BETWEEN" ? "selected" : "") + ` value="BETWEEN">BETWEEN</option>
                <option ` + (conditions[i].type == "LIKE" ? "selected" : "") + ` value="LIKE">LIKE</option>
                <option ` + (conditions[i].type == ">" ? "selected" : "") + ` value=">">&gt;</option>
                <option ` + (conditions[i].type == ">=" ? "selected" : "") + ` value=">=">&ge;</option>
                <option ` + (conditions[i].type == "<" ? "selected" : "") + ` value="<">&lt;</option>
                <option ` + (conditions[i].type == "<=" ? "selected" : "") + ` value="<=">&le;</option>
            </select>
            <input class="dropdown" onchange="SetConditionField(`+ i + `, 'value1', this.value)" value="` + conditions[i].value1 + `" placeholder="Valor 1">
            ` + (conditions[i].type == "BETWEEN" ? `<input class="dropdown" onchange="SetConditionField(` + i + `, 'value2', this.value)" value="` + conditions[i].value2 + `" placeholder="Valor 2">` : "") + `
            <div class="w-[200px] flex justify-center items-center button cardTemplate" onclick="RemoveCondition(` + i + `)">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="1.2"></g><g id="SVGRepo_iconCarrier"> <path d="M6 12L18 12" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            </div>
        </div>
        `
    }
    document.getElementById("whereDropdown").innerHTML = data
}

function RefreshQuery() {
    document.getElementById("submit").setAttribute("disabled", true)
    let disabled = true
    query = "SELECT "
    if (distinct) query += "DISTINCT "
    if (campos.length > 0) {
        query += campos.join(", ") + " FROM " + tabela;
        disabled = false
    }
    if (conditions.length > 0) {
        disabled = true
        query += " WHERE "
        let count = 0
        let condition = ""
        for (let i = 0; i < conditions.length; i++) {
            if (conditions[i].type != "any") {
                condition = conditions[i].type + " " + conditions[i].value1
                if (conditions[i].type == "BETWEEN") {
                    condition = conditions[i].type + " " + conditions[i].value1 + " AND " + conditions[i].value2
                }
                count++;
                query += (conditions[i].function != "any" ? conditions[i].function + "(" + conditions[i].name + ") " : conditions[i].name + " ") + condition + " AND "
            }
        }
        if (count > 0) {
            disabled = false
            query = query.substring(0, query.length - 5)
            document.getElementById("submit").removeAttribute("disabled")
        }
    }
    if (orderField != "" && orderField != "any") {
        query += " ORDER BY " + orderField + " " + orderType
    }
    queryInput.value = query
    if (!disabled) document.getElementById("submit").removeAttribute("disabled")
}

function RefreshFields() {
    let data = ""
    for (let i2 = 0; i2 < BDData[tabela].length; i2++) {
        const field = BDData[tabela][i2];
        data += `
        <div class="flex flex-row gap-3">
            <input type="checkbox" onchange="SetFields(this)" value="` + field.name + `"/>
            <label>` + field.name + `</label>
        </div>
        `
    }
    document.getElementById("fieldDropdown").innerHTML = data
}

function RefreshIfFields() {
    let data = "<option value='any'>Nenhum</option>"
    for (let i2 = 0; i2 < BDData[tabela].length; i2++) {
        const field = BDData[tabela][i2];
        data += `<option value=` + field.name + `>` + field.name + `</option>"`
    }
    document.getElementById("fieldsDropdown").innerHTML = data
}

function RefreshOrderFields() {
    let data = "<option value='any'>Nenhum</option>"
    for (let i = 0; i < BDData[tabela].length; i++) {
        const field = BDData[tabela][i];
        data += `<option value=` + field.name + `>` + field.name + `</option>"`
    }
    document.getElementById("fieldDropdown2").innerHTML = data
}

function RemoveRow(index) {
    query = "DELETE FROM " + lastTabela + " WHERE " + BDData[lastTabela].filter((column) => column.constraints = "PRIMARY KEY")[0].name + " = " + queryResult[index][BDData[lastTabela].filter((column) => column.constraints = "PRIMARY KEY")[0].name]
    queryInput.value = query
    document.getElementById("submit").removeAttribute("disabled")
}

async function ExecuteQuery() {
    let result = await fetch("request.php?query=" + query)
    const data = await result.json()
    queryResult = data
    if (data[0]) {
        let text = ""
        let keys = Object.keys(data[0])
        text += "<tr>"
        for (let i = 0; i < keys.length; i++) {
            text += "<th>" + keys[i] + "</th>"
        }
        text += "<th></th>"
        text += "</tr>"
        for (let i = 0; i < data.length; i++) {
            text += "<tr>"
            for (let i2 = 0; i2 < keys.length; i2++) {
                text += "<td>" + data[i][keys[i2]] + "</td>"
            }
            text += "<td><button class='card h-max button' onclick='RemoveRow(" + i + ")'>Remover</button></td>"
            text += "</tr>"
        }
        document.getElementById("bdBody").innerHTML = text
    }
    query = ""
    distinct = false
    orderField = ""
    orderType = "ASC"
    lastTabela = tabela
    tabela = "any"
    tableDropdown.value = "any"
    fieldInput.style.display = "none"
    whereInput.style.display = "none"
    orderInput.style.display = "none"
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