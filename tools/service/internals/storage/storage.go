package storage

import "github.com/golang/protobuf/ptypes/timestamp"

type State interface {
	Key() string
	Value() string
	SetValue(string)
	Timestamp() timestamp.Timestamp
}

type SimpleKey struct {
	
}

func (s SimpleKey) Key() string {
	panic("implement me")
}

func (s SimpleKey) SetValue(value string) {
	
}

func (s SimpleKey) Value() string {
	panic("implement me")
}

func (s SimpleKey) Timestamp() timestamp.Timestamp {
	panic("implement me")
}

type Storage interface {
	GetAllStates() ([]State, error)
	GetStateByKey(key string) (State, error)
	PutStateByKey(key, value string) error
	GetHistoryByKey(key string) ([]State, error)
}

type InMemoryStorage struct {
	
}

func (i InMemoryStorage) GetAllStates() ([]State, error) {
	panic("implement me")
}

func (i InMemoryStorage) GetStateByKey(key string) (State, error) {
	panic("implement me")
}

func (i InMemoryStorage) PutStateByKey(key, value string) error {
	panic("implement me")
}

func (i InMemoryStorage) GetHistoryByKey(key string) ([]State, error) {
	panic("implement me")
}


