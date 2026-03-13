Gemini Gem Handoff Pack
=======================

Purpose
-------
This folder contains source documents and PDFs designed to help create a Gemini Gem that can build
the same Checkout.com Flow sandbox demo app that was built in this chat.

What is included
----------------
1. 01_intake_questionnaire.txt
   The exact questions the Gem should ask before it starts coding.

2. 02_gem_system_instructions.txt
   A ready-to-use instruction block for the Gemini Gem itself.

3. 03_app_spec_and_acceptance.txt
   The implementation spec and acceptance criteria for the app.

4. 04_troubleshooting_and_manual_data_notes.txt
   Issues discovered during implementation and the manual inputs that were necessary.

5. Matching PDF files
   Generated from the plain-text files for easier sharing.

Recommended use
---------------
1. Create a new Gemini Gem.
2. Use 02_gem_system_instructions.txt as the primary Gem instruction source.
3. Add 03_app_spec_and_acceptance.txt as supporting product/build context.
4. Add 04_troubleshooting_and_manual_data_notes.txt as implementation and debugging context.
5. Instruct Gemini to begin by using 01_intake_questionnaire.txt and collecting all missing
   user-specific values before writing code.

Important constraint
--------------------
The Gem should not proceed directly to coding until the user provides the manual values that were
required in this chat, especially the Checkout.com account-specific values and any GitHub publishing
credentials.

Project this pack refers to
---------------------------
Local path:
/Users/marketplace/checkout-flow-demo

GitHub repo:
https://github.com/thevictormercado/checkout-flow-demo

Latest local commit at the time this pack was generated:
00f30f0 Build Checkout.com Flow sandbox demo
