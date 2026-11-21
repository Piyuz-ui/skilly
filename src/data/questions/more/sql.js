// Extra SQL questions (IDs continue at sql-easy-17 …). Standard SQL.
export const easy = [
  ['select', 'Which keyword removes duplicate rows from a result?', 'SELECT ___ city FROM customers;', ['DISTINCT', 'UNIQUE', 'GROUP', 'SINGLE'], 'SELECT DISTINCT returns each different value once.'],
  ['filtering', 'Which condition finds rows where email has no value?', null, ['WHERE email IS NULL', 'WHERE email = NULL', "WHERE email = ''", 'WHERE email == NULL'], 'NULL is not equal to anything (even NULL), so use IS NULL.'],
  ['filtering', "Which rows does WHERE city IN ('Pune', 'Delhi') match?", null, ['Rows where city is Pune or Delhi', 'Rows where city is both Pune and Delhi', 'Rows where city contains Pune', 'Every row except Pune and Delhi'], 'IN is a short way to write several OR conditions.'],
  ['aggregation', 'How do COUNT(*) and COUNT(email) differ?', null, ['COUNT(email) skips rows where email is NULL', 'They are always the same', 'COUNT(*) skips NULL rows', 'COUNT(email) counts distinct emails'], 'COUNT(column) counts only non-NULL values.'],
  ['select', 'What does ORDER BY price DESC do?', null, ['Sorts with the highest price first', 'Sorts with the lowest price first', 'Removes the price column', 'Groups by price'], 'DESC means descending order.'],
  ['modification', 'Which statement adds a new row?', null, ['INSERT INTO', 'ADD ROW', 'UPDATE', 'CREATE ROW'], 'INSERT INTO table (cols) VALUES (...) adds rows.'],
  ['filtering', 'Does WHERE price BETWEEN 10 AND 20 include prices of exactly 10 and 20?', null, ['Yes, both ends are included', 'No, both ends are excluded', 'Only 10 is included', 'Only 20 is included'], 'BETWEEN is inclusive on both ends.'],
  ['select', 'What does LIMIT 5 do (in PostgreSQL, MySQL, SQLite)?', null, ['Returns at most 5 rows', 'Returns rows 5 and later', 'Limits each value to 5 characters', 'Fails if there are more than 5 rows'], 'LIMIT caps how many rows come back. SQL Server uses TOP instead.'],
];

export const medium = [
  ['joins', 'customers LEFT JOIN orders: how do customers with no orders appear?', null, ['Once, with NULL in the order columns', 'They are left out', 'Once per other order', 'With zeros in the order columns'], 'LEFT JOIN keeps every left-side row and fills missing matches with NULL.'],
  ['aggregation', 'Why does WHERE COUNT(*) > 2 fail?', null, ['Aggregates must be filtered with HAVING, after GROUP BY', 'COUNT cannot be compared with numbers', 'WHERE only works with text', 'It needs DISTINCT'], 'WHERE filters rows before grouping; HAVING filters groups.'],
  ['subqueries', 'What does WHERE id IN (SELECT customer_id FROM orders) find?', 'SELECT * FROM customers\nWHERE id IN (SELECT customer_id FROM orders);', ['Customers who have at least one order', 'Customers with no orders', 'Every customer', 'Only the first customer'], 'IN keeps ids that appear in the subquery result.'],
  ['design', 'What is a foreign key for?', null, ['It references another table’s key so related rows stay valid', 'It encrypts a column', 'It speeds up every query', 'It is a second primary key'], 'The database rejects values that do not exist in the referenced table.'],
  ['modification', 'What happens with UPDATE users SET active = 0; (no WHERE)?', null, ['Every row in users is updated', 'Nothing: WHERE is required', 'Only the first row changes', 'The column is deleted'], 'Without WHERE, UPDATE and DELETE affect every row. Always double-check before running.'],
  ['aggregation', 'What does SELECT city, COUNT(*) FROM customers GROUP BY city return?', null, ['One row per city with how many customers it has', 'One row per customer', 'The total number of cities', 'An error'], 'GROUP BY makes one group per city; COUNT(*) counts rows in each.'],
  ['joins', 'What does an INNER JOIN return?', null, ['Only rows that have a match in both tables', 'All rows from both tables', 'All rows from the left table', 'Rows with no match'], 'Unmatched rows on either side are dropped.'],
  ['design', 'Why add an index on orders.customer_id?', null, ['To speed up lookups and joins on that column', 'To make customer_id unique', 'To save disk space', 'To sort the table permanently'], 'Indexes speed reads on the column at a small cost to writes.'],
];

export const hard = [
  ['windows', 'What does ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) = 1 select?', null, ['The highest-paid employee in each department', 'The first employee hired', 'Every employee', 'The lowest salary overall'], 'Numbering restarts per department and the top salary gets 1.'],
  ['windows', 'Salaries 100, 100, 90 ordered descending: what does RANK() give?', null, ['1, 1, 3', '1, 1, 2', '1, 2, 3', '1, 2, 2'], 'RANK leaves a gap after ties; DENSE_RANK would give 1, 1, 2.'],
  ['transactions', 'What does the I in ACID (Isolation) mean?', null, ['Concurrent transactions do not see each other’s uncommitted changes', 'Data is stored on separate disks', 'Each table is locked forever', 'Queries run one at a time'], 'Isolation levels control how much concurrent transactions can see of each other.'],
  ['subqueries', 'If the subquery returns a NULL, what does WHERE id NOT IN (subquery) return?', null, ['No rows', 'Every row', 'Only rows with NULL ids', 'An error'], 'id NOT IN (…, NULL) is never true. Use NOT EXISTS instead.'],
  ['transactions', 'What does ROLLBACK do?', null, ['Undoes changes made since the transaction began', 'Deletes the table', 'Saves the changes permanently', 'Restarts the database'], 'COMMIT keeps changes; ROLLBACK discards them.'],
  ['windows', 'What does SUM(amount) OVER (ORDER BY day) produce?', null, ['A running total up to each day', 'The total of all days on every row', 'One row per day', 'The average amount'], 'With ORDER BY, the default window runs from the first row to the current row.'],
  ['design', 'What does third normal form (3NF) remove?', null, ['Columns that depend on other non-key columns', 'All NULL values', 'Every foreign key', 'Duplicate tables'], 'In 3NF, non-key columns depend only on the key (no transitive dependencies).'],
  ['joins', 'A JOIN suddenly returns many more rows than expected. What is the most likely cause?', null, ['Joining on a column that is not unique on one side', 'A missing ORDER BY', 'Using LIMIT', 'Too many indexes'], 'Each match repeats rows; check that the join key is unique where you expect it to be.'],
];
