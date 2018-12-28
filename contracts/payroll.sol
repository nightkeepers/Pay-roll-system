pragma solidity ^0.4.24;

import "./SafeMath.sol";

contract Payroll{
	uint constant Days = 30 days;
	struct Employee{
	    address id;
		uint salary;
		uint past;	
		uint bonus;
	}

	mapping(address => Employee) employees;

	address boss;
	uint totalSalary;
	uint totalEmployee;
	uint balance2;

	constructor(){
		totalSalary = 0;
		totalEmployee = 0;
		balance2 = 0;
		boss = msg.sender;
	}

	function setBoss(address ID){
		require((totalEmployee == 0)||(msg.sender==boss));
		boss = ID;
	}

	function getBoss() returns(address)
	{
		return boss;
	}

	function addEmployee(address ID, uint salary, uint bonus) {
	    //check sender
		require(msg.sender == boss);
        
        //check employee already exists
		var employee = employees[ID];
		assert(employee.id == 0x0);
		// add employee
		employees[ID] = Employee(ID, SafeMath.mul(salary, 1 ether), now,  SafeMath.mul(bonus, 1 ether));
		totalSalary  = SafeMath.add(totalSalary, SafeMath.mul(salary, 1 ether));
		totalEmployee = SafeMath.add(totalEmployee, 1);
	}

	function removeEmployee(address ID) returns(uint salary2){
		require(msg.sender == boss);
        
        //check employee not exists
		var employee = employees[ID];
		assert(employee.id != 0x0);
		
		// compute salary
		salary2 = SafeMath.mul(employee.salary, SafeMath.div(SafeMath.sub(now, employee.past), Days));
		totalSalary = SafeMath.sub(totalSalary, employee.salary);
		
		//transfer
		balance2 = SafeMath.sub(balance2, salary2);
		balance2 = SafeMath.sub(balance2, employee.bonus);
		employee.id.transfer(salary2);
		employee.id.transfer(employee.bonus);
		delete employees[ID];
		totalEmployee = SafeMath.sub(totalEmployee, 1);
		/*employees[i] = employee[employee.length - 1]
		employees.length -= 1;*/
	}

	function updateEmployee(address ID, uint sal){
		require(msg.sender == boss);

		var employee = employees[ID];
		assert(employee.id != 0x0);

		uint salary2  = SafeMath.mul(employee.salary, SafeMath.div(SafeMath.sub(now, employee.past), Days));
		totalSalary = SafeMath.sub(totalSalary, employee.salary);
		employee.id.transfer(salary2);
		balance2 = SafeMath.sub(balance2, salary2);
		//update salary
		employees[ID].salary =  SafeMath.mul(sal, 1 ether);
		employees[ID].past  = now;
		totalSalary = SafeMath.add(totalSalary, employee.salary);
	}

	function addBonus(address ID, uint bonus){
		require(msg.sender == boss);

		var employee = employees[ID];
		assert(employee.id != 0x0);
		// add bonus
		employees[ID].bonus = SafeMath.add((employee.bonus), SafeMath.mul(bonus, 1 ether));
	}


	function getEmployee(address ID) returns(uint salary, uint past, uint bonus){
		var employee = employees[ID];
		assert(employee.id != 0x0);
		salary = employee.salary;
		past = employee.past;
		bonus = employee.bonus;
	}

	function getTotalemployee() returns(uint){
		return totalEmployee;
	}

	function addFund() payable returns(uint){
	    require(msg.sender == boss);
		//this.balance = msg.value;
		balance2 = SafeMath.add(balance2, msg.value);
		return balance2;
	}

	function getBalance() returns(uint){
		return balance2;
	}

	function calculateSalary() returns(uint){
		return (balance2 * 1 ether)/totalSalary;
	}

	function isFundEnough() returns(bool){
		return calculateSalary() > 0;
	}

	function getPaid() payable{
	    // get employee
		var employee = employees[msg.sender];
		assert(employee.id != 0x0);
		
		//check if it's time to pay
		uint next = employee.past + Days;
		/*if(next > now)
		{
			revert();
		}*/

		assert(next < now);
		// transfer payment
		employees[msg.sender].past = next;
		balance2 = SafeMath.sub(balance2, employee.salary);
		employee.id.transfer(employee.salary);
	}

	function getBonus() payable{
		var employee = employees[msg.sender];
		assert(employee.id != 0x0);	
		// transfer bonus
		employee.id.transfer(employee.bonus);
		balance2 = SafeMath.sub(balance2, employee.bonus);
		employees[msg.sender].bonus = 0;	
	}
}