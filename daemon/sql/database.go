package sql

import (
	"github.com/ethereum/go-ethereum/core/types"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Database struct {
	db *gorm.DB
}

func ConnectDatabase(dbPath string) (*Database, error) {
	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	// For now drop table at every run, we need to add some propagation of data
	// so we don't miss anything on restarts.
	db.Migrator().DropTable(&BlockDetails{})
	db.Migrator().CreateTable(&BlockDetails{})

	return &Database{
		db: db,
	}, nil
}

func (d *Database) AddBlock(blockDetails BlockDetails) {
	d.db.Create(blockDetails)
}
func (d *Database) UpdateBlock(header *types.Header, burned string, tips string, transactions uint) {
	d.db.Create(&BlockDetails{
		Block:        uint(header.Number.Uint64()),
		Timestamp:    header.Time,
		Burned:       burned,
		Issued:       "0x0",
		Tips:         tips,
		Transactions: transactions,
	})
}
