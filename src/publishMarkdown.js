import fs from 'fs';
import path from 'path';

import nodePlop from 'node-plop';
const plop = await nodePlop(`./plopfile.js`);

const directory = 'docs/generated';

export default async (databases) => {
  // get a generator by name
  const basicAdd = plop.getGenerator('table');
  const modifySidebar = plop.getGenerator('sidebar');

  fs.rmSync(path.join(directory), { recursive: true, force: true }, (err) => {
    if (err) throw `Error deleting directory: ${err}`;
    console.log('Deleted directory: ' + directory);
  });

  fs.mkdirSync(directory, (err) => {
    if (err) throw `Error making directory: ${err}`;
    console.log('Created directory: ' + directory);
  });

  fs.writeFileSync(path.join(directory, 'README.md'), 'hi');

  // write to file
  await Promise.all(
    databases.map(async (db) => {
      db.tables.map(async (table) => {
        const { failures } = await basicAdd.runActions({
          database: db.database,
          name: table.name,
        });
        if (failures.length > 0) {
          failures.forEach((failure) => {
            console.error(failure.error);
          });
        }
      });
    }),
  );

  // TODO: append synchronosly to sidebar?
  let sidebarOutput = `- [Home](/)
- [Entities](/generated/README.md)`;
  databases.map(async (db) => {
    db.tables.forEach(
      (table) =>
        (sidebarOutput = `${sidebarOutput}
  - [${db.database}/${table.name}](/generated/${db.database}/${table.name}.md)`),
    );
  });
  const { failures2 } = await modifySidebar.runActions({
    list: sidebarOutput,
  });
  if (failures2 && failures2.length > 0) {
    failures2.forEach((failure) => {
      console.error(failure.error);
    });
  }
  // console.log(input.tables[0]);
  console.log('Success!', databases.length, 'files generated');
};
