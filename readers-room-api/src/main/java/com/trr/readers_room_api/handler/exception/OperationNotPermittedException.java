package com.trr.readers_room_api.handler.exception;

public class OperationNotPermittedException extends RuntimeException{

    public OperationNotPermittedException(String msg){
        super(msg);
    }
}
