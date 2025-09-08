import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

const runKanbanMigration = async () => {
  let connection;
  
  try {
    // Configuration de la base de données
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'oxymore_db',
      multipleStatements: true
    });

    console.log('🔗 Connexion à la base de données établie');

    // Lire le fichier de migration
    const migrationPath = path.join(__dirname, '../database/migrations/create_kanban_tables.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Migration Kanban chargée');

    // Exécuter la migration
    await connection.execute(migrationSQL);

    console.log('✅ Migration Kanban exécutée avec succès !');
    console.log('📊 Tables créées :');
    console.log('   - kanban_boards (tableaux Kanban)');
    console.log('   - kanban_tickets (tickets)');
    console.log('   - kanban_tags (tags)');
    console.log('   - kanban_ticket_tags (liaison tickets-tags)');
    console.log('🎯 Données de test insérées');

  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution de la migration :', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Connexion fermée');
    }
  }
};

// Exécuter la migration si le script est appelé directement
if (require.main === module) {
  runKanbanMigration();
}

export default runKanbanMigration;

