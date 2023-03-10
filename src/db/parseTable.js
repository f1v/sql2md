import { parseTableRelationships } from './parseTableRelationships.js';
import { parseTableColumns } from './parseTableColumns.js';
import { parseTableConstraints } from './parseTableConstraints.js';
import { parseTableIndexes } from './parseTableIndexes.js';
import { exec } from './connection.js';

export const parseTable = async (db, table) => {
  const [fields] = await exec(
    `
    SELECT * 
    FROM INFORMATION_SCHEMA.TABLES 
    WHERE table_schema = ? 
        AND table_name = ?
     `,
    [db, table],
  );

  const relationships = await parseTableRelationships(db, table);
  const constraints = await parseTableConstraints(db, table);
  const columns = await parseTableColumns(db, table);
  const indexes = await parseTableIndexes(db, table);

  return {
    name: table,
    constraints,
    columns,
    indexes,
    relationships,
    ...fields[0],
  };
};
