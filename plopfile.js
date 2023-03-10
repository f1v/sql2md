export default function (plop) {
  plop.setPartial(
    'attributeRow',
    '`{{column.COLUMN_NAME}}` __<small style="color: #8792a2">{{column.DATA_TYPE}}</small>__\n\n{{{column.COLUMN_COMMENT}}} The id of the comment that we are about to display.\n\n---\n',
  );
  plop.setPartial(
    'columnTableRow',
    '|{{column.COLUMN_NAME}}|{{column.DATA_TYPE}}|{{column.COLUMN_COMMENT}}\n',
  );
  plop.setPartial('refTableRow', '|{{ref.COLUMN_NAME}}|{{ref.DATA_TYPE}}|\n');

  plop.setGenerator('table', {
    description: 'table page generator',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'table name',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'docs/generated/{{database}}/{{name}}.md',
        templateFile: 'src/plop-templates/tablePage.hbs.md',
      },
    ],
  });

  plop.setGenerator('sidebar', {
    description: 'sidebar generator',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'table name',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'docs/generated/_sidebar.md',
        template: '{{list}}',
      },
    ],
  });
}
