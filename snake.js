/*function startGame()
{

}
*/
;(function(){

		class Snake()
	{
		constructor()
		{
			console.log("me crearon");
			this.draw();
		}

		draw()
		{
			console.log("entré a draw");
		}
	}
	var myBody = document.getElementById("theBody")
	var mySpan = document.createElement("span");
	myBody.appendChild(mySpan);

	Snake snake= new Snake();

})()
