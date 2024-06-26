# Planning

### What ?

- A functionality where user can give vote to the given set of candidate


## work 
- Routes
- models

## Functionality

1) user sign in / sign up

2) able to see the list of all candidate

3) only vote one candidate

4) there is a route which show the list of candidate and their live vote counts sorted by their vote count

5) user data must contain their one unqiue government is proof card name : Aadhar card

6) their should be one admin who can maintaion the table of candidates and he can't able to vote at all

7) user can change their password

8) user can log in with aadhar card number and password


-------------------------------------------------------

## Routes

#### User Authentication :
        / signup :  Post - create a new user account
        / signin : Post - log in to an existing account

#### Voting : 
        /candidates : Get - Get the lost of candidates
        /vote/:candidate : Post - vote for a specific candidate

#### User Profile :
        /profile : Get - get the user's profile information
        /profile/password : Put - change the user's password

#### Admin Candidate Management :
        /candidates : Post - carete a new candidate.
        /candidate/:candidateId : Put - Update an existing candidate
        /candidate/:candidateId : Delete - delete a candidate from the list...
