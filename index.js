let prefix = ""
let BDData = {}

let query = ""

let type = ""
let action = ""
let foreignTable = ""
let foreignField = ""
let primaryTable = ""
let primaryField = ""
let isUnique = false

function SetType(value) {
    type = value
    actionInput.style.display = "none"
    tableInput.style.display = "none"
    table2Input.style.display = "none"
    fieldsInput.style.display = "none"
    fields2Input.style.display = "none"
    checkBoxInput.style.display = "none"
    action = ""
    primaryTable = ""
    primaryField = ""
    foreignField = ""
    foreignTable = ""
    actionDropdown.value = "any"
    isUnique = false
    if (value != "any") {
        actionInput.style.display = "block"
    }
    RefreshQuery()
}

function SetAction(value) {
    action = value
    tableInput.style.display = "none"
    table2Input.style.display = "none"
    fieldsInput.style.display = "none"
    fields2Input.style.display = "none"
    checkBoxInput.style.display = "none"
    if (value != "any") {
        tableInput.style.display = "block"
    } else {
        primaryTable = ""
        primaryField = ""
        foreignField = ""
        foreignTable = ""
        isUnique = false
    }
    RefreshTables()
    RefreshQuery()
}

function SetTable(value) {
    foreignTable = value
    table2Input.style.display = "none"
    fieldsInput.style.display = "none"
    fields2Input.style.display = "none"
    checkBoxInput.style.display = "none"
    if (value != "any") {
        fieldsInput.style.display = "block"
    } else {
        primaryTable = ""
        primaryField = ""
        foreignField = ""
        isUnique = false
    }
    RefreshFields()
    RefreshQuery()
}

function SetTable2(value) {
    primaryTable = value
    fields2Input.style.display = "none"
    if (value != "any") {
        fields2Input.style.display = "block"
    } else {
        SetField2()
    }
    RefreshFields2()
    RefreshQuery()
}

function SetUnique(value) {
    isUnique = value
    RefreshQuery()
}

function SetField(value) {
    foreignField = value
    table2Input.style.display = "none"
    fields2Input.style.display = "none"
    checkBoxInput.style.display = "none"
    if (value != "any") {
        if (action != "delete") {
            if (type != "index") {
                table2Input.style.display = "block"
            } else {
                checkBoxInput.style.display = "block"
            }
        }
    } else {
        primaryTable = ""
        primaryField = ""
        isUnique = false
    }
    RefreshTables2()
    RefreshQuery()
}

function SetField2(value) {
    primaryField = value
    RefreshQuery()
}


function RefreshQuery() {
    document.getElementById("submit").setAttribute("disabled", true)
    query = ""
    if (type == "foreignKey") {
        if (action == "create") {
            query = "ALTER TABLE "
            if (foreignTable != "" && foreignTable != "any") {
                query += foreignTable
                if (foreignField != "" && foreignField != "any") {
                    query += " ADD CONSTRAINT FK_" + foreignTable + foreignField + " FOREIGN KEY(" + foreignField + ")"
                    if (primaryTable != "" && primaryTable != "any") {
                        query += " REFERENCES " + primaryTable
                        if (primaryField != "" && primaryField != "any") {
                            query += "(" + primaryField + ")"
                            document.getElementById("submit").removeAttribute("disabled")
                        }
                    }
                }
            }
        } else if (action == "delete") {
            query = "ALTER TABLE "
            if (foreignTable != "" && foreignTable != "any") {
                query += foreignTable
                if (foreignField != "" && foreignField != "any") {
                    query += " DROP FOREIGN KEY FK_" + foreignTable + foreignField
                    document.getElementById("submit").removeAttribute("disabled")
                }
            }
        }
    } else if (type == "index") {
        if (action == "create") {
            query = "CREATE INDEX idx_"
            if (isUnique) query = "CREATE UNIQUE INDEX idx_"
            if (foreignField != "" && foreignField != "any") {
                query += foreignField + " ON " + foreignTable + "(" + foreignField + ")"
                document.getElementById("submit").removeAttribute("disabled")
            }
        } else if (action == "delete") {
            query = "ALTER TABLE "
            if (foreignTable != "" && foreignTable != "any") {
                query += foreignTable
                if (foreignField != "" && foreignField != "any") {
                    query += " DROP INDEX idx_" + foreignField
                    document.getElementById("submit").removeAttribute("disabled")
                }
            }
        }
    }
    queryInput.value = query
}

async function ExecuteQuery() {
    let result = await fetch("request.php?query=" + query)
    actionInput.style.display = "none"
    tableInput.style.display = "none"
    table2Input.style.display = "none"
    fieldsInput.style.display = "none"
    fields2Input.style.display = "none"
    checkBoxInput.style.display = "none"
    type = ""
    action = ""
    primaryTable = ""
    primaryField = ""
    foreignField = ""
    foreignTable = ""
    isUnique = false
    document.getElementById("typeDropdown").value = "any"
    document.getElementById("submit").setAttribute("disabled", true)
    RefreshQuery()
    GetDatabases()
}

function RefreshFields() {
    let data = '<option value="any">Nenhum</option>'
    for (let i = 0; i < BDData[foreignTable].length; i++) {
        if (BDData[foreignTable][i].constraints != "PRIMARY KEY" && (!BDData[foreignTable][i].foreignKeys) || action == "delete") data += '<option value="' + BDData[foreignTable][i].name + '">' + BDData[foreignTable][i].name + '</option>'
    }
    fieldsDropdown.innerHTML = data
}

function RefreshFields2() {
    let data = '<option value="any">Nenhum</option>'
    for (let i = 0; i < BDData[primaryTable].length; i++) {
        if (BDData[primaryTable][i].constraints == "PRIMARY KEY") data += '<option value="' + BDData[primaryTable][i].name + '">' + BDData[primaryTable][i].name + '</option>'
    }
    fields2Dropdown.innerHTML = data
}

function RefreshTables() {
    let data = '<option value="any">Nenhum</option>'
    let tables = Object.keys(BDData)
    for (let i = 0; i < tables.length; i++) {
        data += '<option value="' + tables[i] + '">' + tables[i] + '</option>'
    }
    tableDropdown.innerHTML = data
}

function RefreshTables2() {
    let data = '<option value="any">Nenhum</option>'
    const BDDataCopy = { ...BDData }
    delete BDDataCopy[foreignTable]
    let tables = Object.keys(BDDataCopy)
    for (let i = 0; i < tables.length; i++) {
        data += '<option value="' + tables[i] + '">' + tables[i] + '</option>'
    }
    table2Dropdown.innerHTML = data
}

async function GetDatabases() {
    BDData = {}
    var result = await fetch("request.php?query=SHOW TABLES")
    var result2 = await fetch("request.php?query=SELECT RefCons.constraint_schema, RefCons.table_name, RefCons.referenced_table_name, RefCons.constraint_name, KeyCol.column_name FROM information_schema.referential_constraints RefCons JOIN information_schema.key_column_usage KeyCol ON RefCons.constraint_schema = KeyCol.table_schema AND RefCons.table_name = KeyCol.table_name AND RefCons.constraint_name = KeyCol.constraint_name")
    var tables = await result.json()
    var foreign_keys = await result2.json()
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
    for (let i = 0; i < foreign_keys.length; i++) {
        let tabela = BDData[foreign_keys[i].TABLE_NAME]
        for (let i2 = 0; i2 < tabela.length; i2++) {
            if (tabela[i2].name == foreign_keys[i].COLUMN_NAME) {
                tabela[i2].foreignKeys = true
            }
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
            data += `<div class="flex flex-row items-center justify-center gap-1"><div class="w-[15px] ` + (field.constraints == "" && !field.foreignKeys ? "hidden" : "") + `"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 9H15.01M15 15C18.3137 15 21 12.3137 21 9C21 5.68629 18.3137 3 15 3C11.6863 3 9 5.68629 9 9C9 9.27368 9.01832 9.54308 9.05381 9.80704C9.11218 10.2412 9.14136 10.4583 9.12172 10.5956C9.10125 10.7387 9.0752 10.8157 9.00469 10.9419C8.937 11.063 8.81771 11.1823 8.57913 11.4209L3.46863 16.5314C3.29568 16.7043 3.2092 16.7908 3.14736 16.8917C3.09253 16.9812 3.05213 17.0787 3.02763 17.1808C3 17.2959 3 17.4182 3 17.6627V19.4C3 19.9601 3 20.2401 3.10899 20.454C3.20487 20.6422 3.35785 20.7951 3.54601 20.891C3.75992 21 4.03995 21 4.6 21H6.33726C6.58185 21 6.70414 21 6.81923 20.9724C6.92127 20.9479 7.01881 20.9075 7.10828 20.8526C7.2092 20.7908 7.29568 20.7043 7.46863 20.5314L12.5791 15.4209C12.8177 15.1823 12.937 15.063 13.0581 14.9953C13.1843 14.9248 13.2613 14.8987 13.4044 14.8783C13.5417 14.8586 13.7588 14.8878 14.193 14.9462C14.4569 14.9817 14.7263 15 15 15Z" stroke="#` + (field.foreignKeys ? "FF0000" : (field.constraints == "PRIMARY KEY" ? "ffdd00" : "0ad223")) + `" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></div><p class="text-center">` + field.name + " " + field.type + "(" + field.size + ")" + `</p></div>`
        }
        data += `
                                    </div>
                                </div>`
    }
    data += ` </div>
            </div>`
    document.getElementById("bdBody").innerHTML = data
}