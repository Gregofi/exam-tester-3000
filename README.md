# exam-tester-3000
Self tester for exams where you need to learn questions which have multiple subquestions. Example:

The x*2 = 4, x is
1) equal to 5
2) larger than 1
3) positive

Here, multiple (2, 3) choices are correct. These are the kind of questions the tester is made of.
They can be added via form in the page. These questions can then be exported and imported as JSON.
The app also tracks which questions you failed to answer correctly. You can review them later.

The tester is hosted [here](https://gregofi.github.io/exam-tester-3000/).

All questions are stored locally in `localStorage`. Be careful when deleting data in the browser, because that might take the questions with it.

## Design note
This app was something i needed for certain exam, it was also created day and a half before it, and time was a factor.
That's why it looks the way it looks (both on inside and outside).
