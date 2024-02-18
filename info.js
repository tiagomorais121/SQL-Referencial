var path = window.location.pathname;
var page = path.split("/").pop().replace(".html", "");

document.getElementById(page).setAttribute("selected", true)

let text = {
    info: [
        {
            title: "Criar uma tabela",
            subtitle: "Para criar uma tabela, utilizamos o comando CREATE TABLE:",
            syntax: `
            CREATE TABLE nome_da_tabela (\n
                coluna1 tipo_de_dados restricoes,\n
            );
            `
        },
        {
            title: "Modificar uma tabela",
            subtitle: "Para modificar uma tabela, utilizamos o comando ALTER TABLE",
            syntax: `
            ALTER TABLE nome_da_tabela\n
                ADD COLUMN nome_da_coluna tipo_de_dados restricoes;
            `
        },
        {
            title: "Remover uma tabela",
            subtitle: "Para remover uma tabela, utilizamos o comando DROP TABLE",
            syntax: `
            DROP TABLE nome_da_tabela;
            `
        },
        {
            title: "Adicionar uma coluna",
            subtitle: "Para adicionar uma coluna, utilizamos o comando ADD COLUMN",
            syntax: `
            ALTER TABLE alunos\n
                ADD COLUMN nome_da_coluna tipo_de_dados;
            `
        },
        {
            title: "Remover uma coluna",
            subtitle: "Para remover uma coluna, utilizamos o comando DROP COLUMN",
            syntax: `
            ALTER TABLE alunos\n
                DROP COLUMN nome_da_coluna tipo_de_dados;
            `
        },
    ],
    constraints: [
        {
            title: "Restrições",
            subtitle: "Tipo de dados numéricos",
            info: `
            <span class="titleSpan">NOT NULL</span>:
                Impede que uma coluna aceite valores nulos.
            <span class="titleSpan">UNIQUE</span>:
                Impede que uma coluna aceite valores duplicados.
            <span class="titleSpan">PRIMARY KEY</span>:
                Combina as restrições NOT NULL e UNIQUE.
            <span class="titleSpan">FOREIGN KEY</span>:
                Impede que uma coluna aceite valores que não existam numa outra tabela.
            <span class="titleSpan">CHECK</span>:
                Impede que uma coluna aceite valores que não atendam a uma condição específica.
            <span class="titleSpan">DEFAULT</span>:
                Define um valor padrão para uma coluna (em novos registos).
            `
        },
        {
            title: "NOT NULL",
            subtitle: "Impede que uma coluna aceite valores nulos.",
            syntax: `
            CREATE TABLE nome_da_tabela (
                coluna1 tipo_de_dados NOT NULL,
                ...
            )`
        },
        {
            title: "UNIQUE",
            subtitle: "Impede que uma coluna aceite valores duplicados.",
            syntax: `
            CREATE TABLE nome_da_tabela (
                coluna1 tipo_de_dados UNIQUE,
                ...
            )`
        },
        {
            title: "PRIMARY KEY",
            subtitle: "Combina as restrições NOT NULL e UNIQUE.",
            syntax: `
            CREATE TABLE nome_da_tabela (
                coluna1 tipo_de_dados PRIMARY KEY,
                ...
            )`
        },
        {
            title: "FOREIGN KEY",
            subtitle: "Impede que uma coluna aceite valores que não existam numa outra tabela.",
            syntax: `
            CREATE TABLE nome_da_tabela (
                coluna1 tipo_de_dados 
                REFERENCES nome_da_outra_tabela(coluna_da_outra_tabela),
                ...
            );
            `
        },
        {
            title: "CHECK",
            subtitle: "Impede que uma coluna aceite valores que não atendam a uma condição específica.",
            syntax: `
            CREATE TABLE nome_da_tabela (
                coluna1 tipo_de_dados,
                CHECK (condicao)
                ...
            )`
        },
        {
            title: "DEFAULT",
            subtitle: "Define um valor padrão para uma coluna (em novos registos).",
            syntax: `
        CREATE TABLE nome_da_tabela (
            coluna1 tipo_de_dados DEFAULT,
            ...)`
        },
    ],
    DataType: [
        {
            title: "Numéricos",
            subtitle: "Tipo de dados numéricos",
            info: `
            <span class="titleSpan">Smallint</span>:
                Número inteiro pequeno
            <span class="titleSpan">Integer</span>:
                Número inteiro
            <span class="titleSpan">Bigint</span>:
                Número inteiro grande
            <span class="titleSpan">Decimal</span>:
                Número decimal (precisão fixa)
            <span class="titleSpan">Numeric</span>:
                Número decimal (precisão variável)
            <span class="titleSpan">Real</span>:
                Número de ponto flutuante (precisão simples)
            <span class="titleSpan">Double</span>:
                Número de ponto flutuante (precisão dupla)
            <span class="titleSpan">Serial</span>:
                Número inteiro autoincrementável
            `
        },
        {
            title: "Data e Hora",
            subtitle: "Tipo de dados de dias e horas",
            info: `
            <span class="titleSpan">Time</span>:
                Hora(sem data)
            <span class="titleSpan">Timestamp</span>:
                Data e hora
            <span class="titleSpan">Timestamp</span>:
                Data e hora com fuso horário
            <span class="titleSpan">Interval</span>:
                Intervalo de tempo
            `
        },
        {
            title: "Texto",
            subtitle: "Tipo de dados de informação",
            info: `
            <span class="titleSpan">Varchar</span>:
                Caractere de comprimento variável
            <span class="titleSpan">Char</span>:
                Caractere de comprimento fixo
            <span class="titleSpan">Text</span>:
                Texto de comprimento ilimitado
            `
        },
        {
            title: "Booleano",
            subtitle: "Tipo de dados de verdadeiro/falso",
            info: `
            <span class="titleSpan">Boolean</span>:
                Verdadeiro ou falso(true / false)
            `
        },
        {
            title: "Outros Tipos Comuns",
            subtitle: "Outros tipos de dados",
            info: `
            <span class="titleSpan">Tipo</span>:
                Descrição
            <span class="titleSpan">array</span>:
                Array de um tipo específico
            <span class="titleSpan">json</span>:
                JSON(texto sem formatação)
            <span class="titleSpan">jsonb</span>:
                JSON(texto binário otimizado)
            <span class="titleSpan">uuid</span>:
                Identificador único universal
            `
        },
    ],
    action: [
        {
            title: "SELECT",
            subtitle: "O comando SELECT é utilizado para selecionar dados de uma base de dados.",
            syntax: `
            SELECT coluna1, coluna2, ...
            FROM nome_tabela
            WHERE condição;`
        },
        {
            title: "INSERT",
            subtitle: "O comando INSERT é utilizado para inserir novos dados numa tabela da base de dados.",
            syntax: "INSERT INTO tabela (coluna1, coluna2, coluna3) VALUES (valor1, valor2, valor3)"
        },
        {
            title: "UPDATE",
            subtitle: "O comando UPDATE é utilizado para atualizar dados numa tabela da base de dados.",
            syntax: "UPDATE tabela SET coluna1 = valor1, coluna2 = valor2 WHERE condicao"
        },
        {
            title: "DELETE",
            subtitle: "O comando DELETE é utilizado para remover dados de uma tabela da base de dados..",
            syntax: "DELETE FROM tabela WHERE condicao"
        },
    ],
    indexs: [
        {
            title: "Índices",
            subtitle: "Índices são estruturas especiais em bases de dados relacionais como o MySQL, que melhoram a velocidade de operações de busca e consulta em tabelas. Estes são particularmente úteis em tabelas grandes, onde realizar uma pesquisa linear (linha a linha) seria ineficaz e demasiado lento."
        },
        {
            title: "O que são ?",
            subtitle: "Imagine um índice de um livro. Ele lista os tópicos e as páginas onde se encontram, facilitando a busca por informações específicas sem a necessidade de folhear todo o livro. Da mesma forma, um índice em uma base de dados funciona como um atalho para localizar dados específicos sem precisar vasculhar toda a tabela. Em vez de usar números de páginas como o índice de um livro, o índice de uma base de dados utiliza ponteiros físicos ou lógicos para direcionar o MySQL diretamente para as linhas que você procura. Isso torna a busca por informações muito mais rápida e eficiente."
        },
        {
            title: "Vantagens",
            subtitle: "",
            info: `
            1. <span class="titleSpan">Aceleração de Consultas</span>:
                Acesso Rápido
                Filtros Eficientes
                Joins Otimizados
            2. <span class="titleSpan">Melhoria de Desempenho</span>:
                Consultas Select
                Consultas Where
                Agregações e Agrupamentos
            3. <span class="titleSpan">Facilidade de Uso</span>:
                Menos trabalho para o sistema
                Experiência aprimorada
            Em resumo, os índices são ferramentas valiosas que podem
            otimizar significativamente o desempenho de um sistema
            de base de dados.
            `
        },
        {
            title: "Utilização com SQL",
            subtitle: "",
            syntax: `
            CREATE INDEX nome_do_indice
            ON nome_da_tabela (coluna);
            DROP INDEX nome_do_indice;
            `
        },
        {
            title: "Tipos de Índices",
            subtitle: "",
            info: `
            <span class="titleSpan">B-tree</span>
                Índice padrão do MySQL.
            <span class="titleSpan">Hash</span>
                Índice optimizado para operações de igualdade.
            <span class="titleSpan">GiST</span>
                Índice genérico de pesquisa em árvore.
            <span class="titleSpan">SP-GiST</span>
                Índice de pesquisa em árvore espacial.
            <span class="titleSpan">GIN</span>
                Índice de pesquisa em árvore invertida genérica.
            <span class="titleSpan">BRIN</span>
                Índice de intervalo de blocos`
        },
    ],
    joins: [
        {
            title: "Joins",
            subtitle: "Joins são usados no MySQL para combinar linhas de duas ou mais tabelas (normalmente) baseadas numa relação entre colunas dessas tabelas. Aqui está uma explicação das diferentes formas de JOIN.",
        },
        {
            title: "LEFT (OUTER) JOIN",
            subtitle: "Retorna todas as linhas da tabela à esquerda (tabela1) e as linhas correspondentes da tabela à direita (tabela2). Se não houver correspondência, os resultados da tabela à direita terão NULL."
        },
        {
            title: "Right (OUTER) JOIN",
            subtitle: "Funciona de forma oposta ao LEFT JOIN, retornando todas as linhas da tabela à direita e as correspondências da tabela à esquerda."
        },
        {
            title: "FULL (OUTER) JOIN",
            subtitle: "Combina as funções do LEFT JOIN e RIGHT JOIN, retornando todas as linhas de ambas as tabelas, com NULL nas colunas onde não existir correspondência."
        },
        {
            title: "CROSS JOIN",
            subtitle: "Realiza um produto cartesiano entre duas tabelas, combinando cada linha da primeira tabela com todas as linhas da segunda tabela."
        },
        {
            title: "SELF JOIN",
            subtitle: "Este tipo de join envolve uma tabela a ser combinada com ela mesma. É usado para comparar e relacionar registos dentro da mesma tabela, como encontrar supervisores de funcionários ou amigos comuns numa rede social. É uma ferramenta útil para análises internas e comparações de dados dentro da mesma entidade."
        },
        {
            title: "INNER JOIN",
            subtitle: "Combina linhas de duas tabelas quando a condição especificada é verdadeira.",
            syntax: `
            SELECT colunas
            FROM tabela1
            INNER JOIN tabela2
            ON tabela1.coluna = tabela2.coluna;
            `
        },
        {
            title: "INNER JOIN",
            subtitle: "Combina funcionários com os seus respectivos departamentos.",
            syntax: `
            SELECT funcionarios.nome, departamentos.nome_departamento
            FROM funcionarios
            INNER JOIN departamentos
            ON funcionarios.departamento_id = departamentos.id;`
        },
        {
            title: "LEFT (OUTER) JOIN",
            subtitle: "Devolve todos os funcionários e os seus departamentos, incluindo funcionários sem departamento associado.",
            syntax: `
            SELECT funcionarios.nome, departamentos.nome_departamento
            FROM funcionarios
            LEFT JOIN departamentos
            ON funcionarios.departamento_id = departamentos.id;`
        },
        {
            title: "RIGHT (OUTER) JOIN",
            subtitle: "Devolve todos os departamentos e os seus funcionários, incluindo departamentos sem funcionários.",
            syntax: `
            SELECT funcionarios.nome, departamentos.nome_departamento
            FROM departamentos
            RIGHT JOIN funcionarios
            ON funcionarios.departamento_id = departamentos.id;`
        },
        {
            title: "FULL (OUTER) JOIN",
            subtitle: "Devolve todos os funcionários e todos os departamentos, com NULL nas colunas onde não existe correspondência.",
            syntax: `
            SELECT funcionarios.nome, departamentos.nome_departamento
            FROM funcionarios
            FULL OUTER JOIN departamentos
            ON funcionarios.departamento_id = departamentos.id;`
        },
        {
            title: "CROSS JOIN",
            subtitle: "Combina cada funcionário com todos os departamentos.",
            syntax: `
            SELECT funcionarios.nome, departamentos.nome_departamento
            FROM funcionarios
            CROSS JOIN departamentos;`
        },
        {
            title: "SELF JOIN",
            subtitle: "Para exemplificar o SELF JOIN, vamos supor que a tabela funcionarios tem uma coluna supervisor_id que referencia outro funcionário como supervisor.",
            syntax: `
            SELECT f1.nome AS Funcionário, f2.nome AS Supervisor
            FROM funcionarios f1
            LEFT JOIN funcionarios f2 ON f1.supervisor_id = f2.id;`
        }
    ],
    operators: [
        {
            title: "Operadores",
            subtitle: "No SQL, os operadores são utilizados para realizar operações matemáticas, comparações e lógicas. Os operadores são utilizados em conjunto com as cláusulas SELECT, UPDATE, DELETE, etc.",
        },
        {
            title: "Operadores Aritméticos",
            subtitle: "",
            info: `
            <span class="titleSpan">+</span> - Adição
            <span class="titleSpan">-</span> - Subtração
            <span class="titleSpan">*</span> - Multiplicação
            <span class="titleSpan">/</span> - Divisão
            <span class="titleSpan">%</span> - Módulo
            `
        },
        {
            title: "Operadores de Comparação",
            subtitle: "",
            info: `
            <span class="titleSpan">=</span> - Igual
            <span class="titleSpan">!=</span> - Diferente
            <span class="titleSpan">></span> - Maior
            <span class="titleSpan"><</span> - Menor
            <span class="titleSpan">>=</span> - Maior ou Igual
            <span class="titleSpan"><=</span> - Menor ou Igual
            `
        },
        {
            title: "Operadores Lógicos",
            subtitle: "",
            info: `
            <span class="titleSpan">AND</span> - Ambas Condições forem Verdadeiras
            <span class="titleSpan">OR</span> - Pelo Menos uma das Condições for Verdadeira
            <span class="titleSpan">NOT</span> - Inverte o Valor da Condição
            `
        },
        {
            title: "Operadores LIKE e ILIKE",
            subtitle: "Utilizados em consultas com padrões (com LIKE para 'case-sensitive' e ILIKE para 'case-insensitive').",
            info: `
            <span class="titleSpan">%</span> - Representa zero ou mais caracteres
            <span class="titleSpan">_</span> - Representa um único caractere
            `
        },
        {
            title: "Operadores IN, BETWEEN e IS NULL",
            subtitle: "",
            info: `
            <span class="titleSpan">IN</span> - Verifica se o valor está dentro de uma lista de valores.
            <span class="titleSpan">BETWEEN</span> - Verifica se o valor está dentro de um intervalo (inclusivo).
            <span class="titleSpan">IS NULL</span> - Verifica se o valor é nulo ou não nulo.
            `
        },
    ],
    views: [
        {
            title: "Views",
            subtitle: "Views, também conhecidas como vistas, são uma ferramenta essencial em bases de dados relacionais. Estas permitem criar 'tabelas virtuais' baseadas no resultado de consultas SQL."
        },
        {
            title: "O que são Views?",
            subtitle: "Uma view é uma consulta SQL armazenada que pode ser usada como se fosse uma tabela. Em vez de armazenar dados, as views simplesmente armazenam a definição de uma consulta. Quando uma view é consultada, o MySQL (ou SGBD em questão) executa a consulta subjacente e retorna os resultados como se fossem de uma tabela."
        },
        {
            title: "Utilização com SQL",
            subtitle: "",
            syntax: `
            CREATE [ OR REPLACE ] VIEW nome_da_view
            AS consulta
            DROP VIEW [ IF EXISTS ] nome_da_view
            `
        },
        {
            title: "Vantagens",
            subtitle: "",
            info: `
            1. <span class="titleSpan">Simplificação de Consultas Complexas:</span>
                Abstração de lógica
                Reutilização de código
                Manutenabilidade aprimorada

            2. <span class="titleSpan">Segurança e Controle de Acesso:</span>
                Restringimento de dados
                Permissões personalizadas
                Proteção contra erros

            3. <span class="titleSpan">Melhoria de Desempenho:</span>
                Cache de resultados
                Filtragem pré-definida
                Otimização de consultas

            4. <span class="titleSpan">Maior Flexibilidade e Agilidade:</span>
                Criação de novas visões
                Independência da estrutura da tabela
                Adaptabilidade a diferentes necessidades

            Em resumo, as views do MySQL oferecem uma variedade
            de vantagens que podem aumentar a produtividade,
            a segurança e o desempenho do seu base de dados.
            `
        },
    ],
}

let data = ""

for (let i = 0; i < text[page].length; i++) {
    data += `
    <div class="infoItem">
        <h1>` + text[page][i].title + `</h1>
        <h2>` + text[page][i].subtitle + `</h2>
        ` + (text[page][i].syntax ? `
        <h3>Sintax:</h3>
        <code>` + text[page][i].syntax + `</code>
        ` : (text[page][i].info ? `
        <h3>Info:</h3>
        <p>` + text[page][i].info + `</p>
        ` : "")) + `
        <br>
    </div>
    `
}

document.getElementById("text").innerHTML = data