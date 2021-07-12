// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

contract PatientControl{
    
    string private name;
    string private email;
    string private mobile;

    mapping(address=>string) private users;
    
    event eventCreatePatient(
        string name,
        string email,
        string mobile,
        uint256 timestamp
    );
    
    function writePatientDetails(string memory _name, string memory _email, string memory _mobile)public{
        name=_name;
        email=_email;
        mobile=_mobile;
        emit eventCreatePatient(name,email,mobile,block.timestamp);
    }

    function writePatientInfo(address _address, string memory _hash)public{
        users[_address]=_hash;
    }

    function getPatientInfo(address _address)public view returns(string memory){
        return users[_address];
    }

    
    function getPatientName()public view returns(string memory){
        return name;
    }
    
    function getPatientEmail()public view returns(string memory){
        return email;
    }

    function getPatientMobile()public view returns(string memory){
        return mobile;
    }
}