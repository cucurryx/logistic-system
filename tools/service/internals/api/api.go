package api

import (
	"service/internals/storage"
	"sync"
)

var (
	once sync.Once
	store *storage.InMemoryStorage
)

func Storage() storage.Storage {
	once.Do(func() {
		store = &storage.InMemoryStorage{
			// TODO 初始化storage
		}
	})
	return store
}