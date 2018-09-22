
/* 
Can I remember how to write Java?
Text based rock paper scissors game. 

Future refactors / improvements: 
- Allow two players instead of vs computer? 
- Set up number of rounds? (best of 3)
- JUnit tests

Run using `javac RockPaperScissors.java` then `java RockPaperScissors`
*/

import java.util.Random;

public class RockPaperScissors {

    public static void main(String[] args) {
        String[] moves = new String[] { "Rock", "Paper", "Scissors" };

        System.out.println("Hello - what's your name?");
        String name = System.console().readLine();

        System.out.println("Hello " + name + "\n Let's play!");

        boolean keepPlaying = true;

        while (keepPlaying) {
            // System.out.println("Started at: " + keepPlaying);
            System.out.println("Pick your move with the corresponding number");
            System.out.println("1 - " + moves[0] + " \n2 - " + moves[1] + "  \n3 - " + moves[2] + "");

            Random random = new Random();
            int programMove = random.nextInt(2) + 1;
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

            System.out.println("Keep playing? Y/N");
            String choice = System.console().readLine();

            System.out.println(choice);
            if (choice.equals("N")) {
                keepPlaying = false;
                System.out.println("Thanks for playing");
            }
        }

    }
}