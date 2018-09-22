
/* 
Can I remember how to write Java?
Text based rock paper scissors game. 

Future refactors / improvements: 
- While loop to keep playing 
- Best of three
- Allow two players instead of vs computer? 

Run using `javac HelloWorld.java` then `java HelloWorld`
*/

import java.util.Random;

public class HelloWorld {

    public static void main(String[] args) {
        String[] moves = new String[] { "Rock", "Paper", "Scissors" };

        System.out.println("Hello - what's your name?");
        String name = System.console().readLine();

        System.out.println("Hello " + name + "\n Let's play. Pick your move with the corresponding number");
        System.out.println("1 - " + moves[0] + " \n2 - " + moves[1] + "  \n3 - " + moves[2] + "");

        Random random = new Random();
        int programMove = random.nextInt(2) + 1; // it's always one, think you've done this wrong
        int playerMove = Integer.parseInt(System.console().readLine());

        System.out.println("You chose " + moves[playerMove - 1] + " and I chose " + moves[programMove - 1]);

        if (playerMove == programMove) {
            System.out.println("It's a draw");
        } else {
            boolean programWins = true;
            if (playerMove == 1 && programMove == 3) {
                programWins = false;
            }
            if (playerMove == 2 && programMove == 1) {
                programWins = false;
            }
            if (playerMove == 3 && programMove == 2) {
                programWins = false;
            }
            System.out.println(programWins ? "I win!!! " : "You win!");
        }
        ;
    }
}