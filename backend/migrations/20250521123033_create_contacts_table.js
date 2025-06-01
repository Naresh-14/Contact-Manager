// migrations/20240325_create_contacts_table.js
exports.up = function(knex) {
    return knex.schema.createTable('contacts', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').unique(); // optional, depends if you want email to be unique
      table.string('phone').notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('contacts');
  };


  