// SQL question bank. Dialect: PostgreSQL 15+ unless a prompt says otherwise.
// Shared example schema:
//   employees(id INT PRIMARY KEY, name TEXT, dept_id INT, salary INT)
//   departments(id INT PRIMARY KEY, name TEXT)
// Row format documented in python.js. Append only.
export const meta = {
  id: 'sql',
  label: 'SQL',
  roadmap: 'sql',
  dialectNote: 'PostgreSQL. Schema: employees(id, name, dept_id, salary), departments(id, name).',
  topics: [
    { key: 'select', label: 'SELECT basics', keywords: ['select', 'basic-sql', 'sql-keywords', 'from', 'order-by', 'distinct'] },
    { key: 'filtering', label: 'Filtering & NULLs', keywords: ['where', 'null', 'filtering', 'like', 'between', 'coalesce'] },
    { key: 'aggregation', label: 'Aggregation & grouping', keywords: ['aggregate', 'group-by', 'having', 'count', 'sum', 'avg'] },
    { key: 'joins', label: 'Joins', keywords: ['join'] },
    { key: 'modification', label: 'Inserting & updating data', keywords: ['insert', 'update', 'delete', 'data-manipulation'] },
    { key: 'design', label: 'Keys, constraints & design', keywords: ['constraint', 'primary-key', 'foreign-key', 'normalization', 'data-definition'] },
    { key: 'subqueries', label: 'Subqueries & CTEs', keywords: ['subquer', 'cte', 'correlated', 'recursive'] },
    { key: 'windows', label: 'Window functions', keywords: ['window', 'rank', 'row_number', 'lead', 'lag'] },
    { key: 'transactions', label: 'Transactions & performance', keywords: ['transaction', 'acid', 'isolation', 'index', 'performance', 'query-optimization', 'locking'] },
  ],
};

export const easy = [
  ['select', 'Which query returns every column of every employee?', null, ['SELECT * FROM employees;', 'SELECT ALL employees;', 'GET * FROM employees;', 'SELECT employees.*all;'], '* selects all columns.'],
  ['filtering', 'Which clause keeps only employees with salary over 50000?', null, ['WHERE salary > 50000', 'HAVING salary > 50000 (without GROUP BY)', 'FILTER salary > 50000', 'IF salary > 50000'], 'WHERE filters individual rows.'],
  ['select', 'How do you list employees from highest to lowest salary?', null, ['ORDER BY salary DESC', 'ORDER BY salary ASC', 'SORT salary DOWN', 'GROUP BY salary DESC'], 'ASC is the default order. DESC reverses it.'],
  ['aggregation', 'What does SELECT COUNT(*) FROM employees; return?', null, ['The number of rows in employees', 'The number of non-null salaries', 'The number of columns', 'The sum of ids'], 'COUNT(*) counts rows regardless of NULLs.'],
  ['select', 'Which returns each dept_id once?', null, ['SELECT DISTINCT dept_id FROM employees;', 'SELECT UNIQUE(dept_id) FROM employees;', 'SELECT dept_id ONCE FROM employees;', 'SELECT dept_id FROM employees LIMIT 1;'], 'DISTINCT removes duplicate rows from the result.'],
  ['modification', 'Which statement adds a department?', null, ["INSERT INTO departments (id, name) VALUES (1, 'Sales');", "ADD departments VALUES (1, 'Sales');", "INSERT departments SET id = 1, name = 'Sales';", "UPDATE departments ADD (1, 'Sales');"], 'INSERT INTO … VALUES adds rows.'],
  ['design', 'What does a PRIMARY KEY guarantee?', null, ['Values are unique and not NULL', 'Values are sorted', 'Values auto-increment', 'Values can repeat but not be NULL'], 'Each row is uniquely identified by its primary key.'],
  ['filtering', "Which names does WHERE name LIKE 'A%' match?", null, ['Names starting with A', 'Names ending with A', 'Names containing only A', 'Exactly "A%"'], '% matches any sequence of characters. LIKE is case-sensitive in PostgreSQL.'],
  ['filtering', 'How do you find rows where dept_id has no value?', null, ['WHERE dept_id IS NULL', 'WHERE dept_id = NULL', "WHERE dept_id = ''", 'WHERE dept_id == NULL'], 'Comparisons with NULL using = yield unknown. Use IS NULL.'],
  ['modification', 'What does UPDATE employees SET salary = 0; do?', null, ['Sets salary to 0 for every row', 'Updates only the first row', 'Fails without WHERE', 'Deletes salaries'], 'Without WHERE, UPDATE affects all rows. Always double-check.'],
  ['aggregation', 'Which query counts employees per department?', null, ['SELECT dept_id, COUNT(*) FROM employees GROUP BY dept_id;', 'SELECT dept_id, COUNT(*) FROM employees;', 'SELECT COUNT(dept_id) GROUP employees;', 'SELECT dept_id FROM employees COUNT BY dept_id;'], 'GROUP BY forms one group per dept_id.'],
  ['joins', 'What does an INNER JOIN between employees and departments return?', null, ['Only rows that have a match in both tables', 'All employees, even without a department', 'All rows from both tables', 'Every combination of rows'], 'Unmatched rows are dropped. Use LEFT JOIN to keep them.'],
  ['select', 'In PostgreSQL, how do you return only the first 5 rows?', null, ['LIMIT 5', 'TOP 5', 'FIRST 5 ONLY', 'ROWNUM <= 5'], 'TOP is SQL Server syntax. FETCH FIRST 5 ROWS ONLY also works in PostgreSQL.'],
  ['filtering', 'Does salary BETWEEN 100 AND 200 include 200?', null, ['Yes — both ends are inclusive', 'No — the upper bound is exclusive', 'Only the lower bound is inclusive', 'It depends on the index'], 'BETWEEN a AND b means >= a AND <= b.'],
  ['modification', 'What is the difference between DELETE FROM t and DROP TABLE t?', null, ['DELETE removes rows; DROP removes the table itself', 'They are identical', 'DROP removes rows only', 'DELETE removes the table'], 'DELETE keeps the table structure.'],
  ['select', 'In SELECT salary * 12 AS annual, what is annual?', null, ['A column alias for the computed value', 'A new table', 'A stored column', 'A function'], 'Aliases name output columns.'],
];

export const medium = [
  ['aggregation', 'How do you keep only departments with more than 5 employees?', null, ['GROUP BY dept_id HAVING COUNT(*) > 5', 'WHERE COUNT(*) > 5 GROUP BY dept_id', 'GROUP BY dept_id WHERE COUNT(*) > 5', 'ORDER BY COUNT(*) > 5'], 'HAVING filters groups after aggregation. WHERE runs before grouping.'],
  ['joins', 'An employee has no matching department. What does a LEFT JOIN from employees to departments return for that employee?', null, ['The employee row, with NULLs in the department columns', 'Nothing for that employee', 'An error', 'The employee matched to every department'], 'LEFT JOIN keeps every left-side row.'],
  ['aggregation', 'Table t has values 1, NULL and 3 in column v. What do COUNT(*) and COUNT(v) return?', null, ['3 and 2', '3 and 3', '2 and 2', '2 and 3'], 'COUNT(column) ignores NULLs.'],
  ['subqueries', 'If the subquery returns (1, NULL), how many rows can WHERE dept_id NOT IN (subquery) return?', null, ['None', 'All rows except dept 1', 'Only rows with NULL dept_id', 'All rows'], 'x NOT IN (1, NULL) is never true; it is false or unknown. Use NOT EXISTS instead.'],
  ['aggregation', 'Column v holds 10, NULL and 20. What is AVG(v)?', null, ['15', '10', '30', 'NULL'], 'Aggregates skip NULLs: (10 + 20) / 2.'],
  ['aggregation', 'What happens in PostgreSQL?', 'SELECT dept_id, name, COUNT(*)\nFROM employees\nGROUP BY dept_id;', ['Error: name must appear in GROUP BY or be used in an aggregate', 'Returns any name per department', 'Returns the first name', 'Returns NULL for name'], 'Non-aggregated columns must be grouped. (MySQL with some settings is more permissive.)'],
  ['subqueries', 'Which query finds employees who earn more than their department’s average?', null, ['SELECT * FROM employees e WHERE salary > (SELECT AVG(salary) FROM employees WHERE dept_id = e.dept_id);', 'SELECT * FROM employees WHERE salary > AVG(salary);', 'SELECT * FROM employees GROUP BY dept_id HAVING salary > AVG(salary);', 'SELECT * FROM employees WHERE salary > ALL(AVG(salary));'], 'A correlated subquery is re-evaluated for each outer row.'],
  ['subqueries', 'How does UNION differ from UNION ALL?', null, ['UNION removes duplicate rows; UNION ALL keeps them', 'UNION ALL removes duplicates', 'UNION sorts by the first column only', 'There is no difference'], 'UNION ALL is cheaper when duplicates are impossible or acceptable.'],
  ['design', 'What does a FOREIGN KEY from employees.dept_id to departments.id enforce?', null, ['Each non-null dept_id must exist in departments.id', 'dept_id is unique', 'departments.id is auto-generated', 'Deleting an employee deletes its department'], 'This is referential integrity. ON DELETE actions are configured separately.'],
  ['subqueries', 'Which returns the second-highest distinct salary?', null, ['SELECT MAX(salary) FROM employees WHERE salary < (SELECT MAX(salary) FROM employees);', 'SELECT salary FROM employees ORDER BY salary LIMIT 2;', 'SELECT MAX(salary) - 1 FROM employees;', 'SELECT salary FROM employees WHERE rank = 2;'], 'It takes the maximum among values below the overall maximum.'],
  ['select', 'Why does this fail in PostgreSQL?', 'SELECT salary * 12 AS annual\nFROM employees\nWHERE annual > 100000;', ['WHERE is evaluated before SELECT, so the alias does not exist yet', 'annual is a reserved word', 'You cannot multiply in SELECT', 'It works'], 'Repeat the expression or wrap the query in a subquery or CTE.'],
  ['filtering', 'What does COALESCE(NULL, NULL, 0, 5) return?', null, ['0', 'NULL', '5', 'An error'], 'COALESCE returns the first non-NULL argument.'],
  ['joins', 'Two rows in A each match three rows in B on the join key. How many rows does the inner join produce?', null, ['6', '3', '2', '5'], 'Each matching pair produces a row, which is why joins can multiply rows.'],
  ['windows', 'What does ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) produce?', null, ['A 1, 2, 3… ranking that restarts in each department, highest salary first', 'A single number per department', 'Global row numbers', 'Salary ranks with ties sharing numbers'], 'PARTITION BY resets the numbering for each group.'],
  ['transactions', 'What does ROLLBACK do inside a transaction?', null, ['Undoes changes made since BEGIN', 'Undoes the last committed transaction', 'Saves the changes', 'Restarts the database'], 'Committed changes cannot be rolled back.'],
  ['transactions', 'What is a common downside of adding an index?', null, ['Writes such as INSERT and UPDATE become slower and use more storage', 'Reads always become slower', 'It removes duplicates', 'It locks the table forever'], 'Indexes must be maintained on every write.'],
];

export const hard = [
  ['windows', 'Salaries are 100, 100 and 90. What do RANK() and DENSE_RANK() (ordered by salary DESC) return?', null, ['RANK: 1, 1, 3 · DENSE_RANK: 1, 1, 2', 'RANK: 1, 2, 3 · DENSE_RANK: 1, 1, 2', 'Both: 1, 1, 2', 'Both: 1, 2, 3'], 'RANK leaves gaps after ties. DENSE_RANK does not.'],
  ['filtering', 'What does WHERE a = b return for a row where both a and b are NULL?', null, ['The row is filtered out — NULL = NULL is unknown', 'The row is kept', 'An error', 'It depends on the index'], 'Use IS NOT DISTINCT FROM for null-safe equality.'],
  ['transactions', 'Which isolation level is the minimum that prevents non-repeatable reads in standard SQL?', null, ['REPEATABLE READ', 'READ UNCOMMITTED', 'READ COMMITTED', 'None'], 'In PostgreSQL, REPEATABLE READ also prevents phantoms through snapshot isolation.'],
  ['transactions', 'Given a B-tree index on (a, b), which predicate generally cannot use it efficiently on its own?', null, ['WHERE b = 5', 'WHERE a = 1', 'WHERE a = 1 AND b = 5', 'WHERE a = 1 ORDER BY b'], 'Multicolumn B-tree indexes are most effective on a leftmost prefix.'],
  ['windows', 'Rows have d = 1, 2, 2, 3 and x = 10 each. What does SUM(x) OVER (ORDER BY d) return, in order?', null, ['10, 30, 30, 40', '10, 20, 30, 40', '40, 40, 40, 40', '10, 30, 40, 40'], 'The default frame is RANGE … CURRENT ROW, which includes peers with the same d.'],
  ['joins', 'What is the effect of this query?', "SELECT e.name, d.name\nFROM employees e\nLEFT JOIN departments d ON d.id = e.dept_id\nWHERE d.name = 'Sales';", ['It behaves like an INNER JOIN — employees without a department are removed', 'It keeps all employees', 'It is a syntax error', 'It returns only NULL departments'], 'Filtering the right table in WHERE discards the NULL-extended rows. Put the condition in ON to keep them.'],
  ['subqueries', 'Why is NOT EXISTS often preferred over NOT IN for anti-joins?', null, ['NOT EXISTS is not affected by NULLs in the subquery', 'NOT IN is not standard SQL', 'NOT EXISTS returns duplicates', 'NOT IN cannot use indexes'], 'A single NULL in a NOT IN list makes the predicate unknown for every row.'],
  ['subqueries', 'What is WITH RECURSIVE used for?', null, ['Querying hierarchical data, such as an org chart, by repeatedly joining a CTE to itself', 'Running a query twice', 'Creating a stored procedure', 'Looping over columns'], 'A recursive CTE has an anchor member and a recursive member joined with UNION [ALL].'],
  ['transactions', 'Transaction 1 locks row A then waits for B. Transaction 2 locks B then waits for A. What happens?', null, ['Deadlock — PostgreSQL aborts one transaction', 'Both wait forever', 'Both succeed', 'A row-level merge'], 'Acquire locks in a consistent order to avoid deadlocks.'],
  ['transactions', 'There is a plain index on email. Why might WHERE LOWER(email) = \'a@b.com\' not use it?', null, ['The index stores email, not LOWER(email) — create an expression index', 'LOWER is not allowed in WHERE', 'Indexes do not work on text', 'It always uses the index'], 'Wrapping an indexed column in a function usually prevents a plain index match.'],
  ['aggregation', 'What does COUNT(DISTINCT dept_id) return?', null, ['The number of different non-null dept_id values', 'The number of rows', 'The number of rows with NULL dept_id', 'An error without GROUP BY'], 'DISTINCT removes duplicates before counting. NULL is ignored.'],
  ['design', 'Which situation violates Third Normal Form (3NF)?', null, ['employees stores dept_id and also dept_name, which depends on dept_id', 'employees has a primary key', 'departments has a name column', 'A table has two columns'], 'A transitive dependency (id → dept_id → dept_name) belongs in a separate table.'],
  ['joins', 'What does this return?', 'SELECT d.*\nFROM departments d\nLEFT JOIN employees e ON e.dept_id = d.id\nWHERE e.id IS NULL;', ['Departments with no employees', 'Employees with no department', 'All departments', 'Nothing'], 'This is the classic LEFT JOIN anti-join pattern.'],
  ['transactions', 'Which isolation level prevents phantom rows in standard SQL?', null, ['SERIALIZABLE', 'READ COMMITTED', 'READ UNCOMMITTED', 'None can'], 'Phantoms are new rows matching a range predicate.'],
  ['windows', 'What does LAG(salary) OVER (ORDER BY id) return for the first row?', null, ['NULL', '0', 'The first salary', 'An error'], 'With no previous row, LAG returns its default, which is NULL unless you pass one.'],
  ['select', 'What does SELECT 5 / 2; return in PostgreSQL?', null, ['2', '2.5', '3', '2.50'], 'Integer / integer truncates. Cast to numeric (5::numeric / 2) for 2.5.'],
];
