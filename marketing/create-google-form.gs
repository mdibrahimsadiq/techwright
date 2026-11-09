/**
 * Creates the Techwright "15-Day Online Internship" registration Google Form
 * and a Google Sheet that collects its responses.
 *
 * How to use:
 *   1. Go to https://script.google.com and click "New project".
 *   2. Delete the sample code, paste this whole file, and click Save.
 *   3. Choose the function "createInternshipForm" and click Run.
 *   4. Allow the permissions Google asks for (it needs to create a Form and a Sheet
 *      in your own Google Drive).
 *   5. Open "Execution log": it prints the link to share and the link to edit the form.
 *
 * Running it again creates another, separate form.
 */
function createInternshipForm() {
  var form = FormApp.create('Techwright – 15-Day Online Internship Registration');

  form.setDescription(
    'Join our 15-day live online internship and build real Cloud and DevOps projects with a mentor.\n\n' +
    '🕕 Time: 7:00 PM – 8:00 PM IST\n' +
    '💻 Mode: Live online\n' +
    '✨ Includes AI-assisted cloud and DevOps training with Claude\n' +
    '📜 Certificate on completion'
  );
  form.setConfirmationMessage("Thanks for registering! We'll contact you soon with the next steps.");
  form.setShowLinkToRespondAgain(false);
  form.setAllowResponseEdits(false);
  form.setCollectEmail(false);

  form.addTextItem()
    .setTitle('Name')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Email')
    .setRequired(true)
    .setValidation(FormApp.createTextValidation()
      .requireTextIsEmail()
      .setHelpText('Enter a valid email address.')
      .build());

  form.addTextItem()
    .setTitle('Mobile number')
    .setRequired(true)
    .setValidation(FormApp.createTextValidation()
      .requireTextMatchesPattern('^\\+?[0-9][0-9 -]{7,15}$')
      .setHelpText('Enter a valid mobile number, for example +91 98765 43210.')
      .build());

  form.addMultipleChoiceItem()
    .setTitle('Internship')
    .setChoiceValues(['Cloud Internship (AWS)', 'DevOps Internship'])
    .setRequired(true);

  form.addTextItem()
    .setTitle('Degree and branch')
    .setHelpText('For example: B.E. CSE')
    .setRequired(true);

  var thisYear = new Date().getFullYear();
  var years = [];
  for (var y = thisYear - 6; y <= thisYear + 5; y++) years.push(String(y));
  form.addListItem()
    .setTitle('Year of passing')
    .setChoiceValues(years)
    .setRequired(false);

  form.addTextItem()
    .setTitle('College name')
    .setRequired(false);

  var sheet = SpreadsheetApp.create('Techwright – Internship Registrations (responses)');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  Logger.log('Share this link:  ' + form.getPublishedUrl());
  Logger.log('Edit the form:    ' + form.getEditUrl());
  Logger.log('Responses sheet:  ' + sheet.getUrl());
}
