from langchain.agents import create_agent
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from tools import web_search, scrape_url
from dotenv import load_dotenv

load_dotenv()


# ============================================================
# MODEL SETUP
# ============================================================

llm = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0
)


# ============================================================
# SEARCH AGENT
# ============================================================

def build_search_agent():

    return create_agent(
        model=llm,
        tools=[web_search]
    )


# ============================================================
# READER AGENT
# ============================================================

def build_reader_agent():

    return create_agent(
        model=llm,
        tools=[scrape_url]
    )


# ============================================================
# WRITER
# ============================================================

writer_prompt = ChatPromptTemplate.from_messages([

    (
        "system",

        """You are an expert research writer.

Your job is to transform the provided research into a clear,
accurate and professional research report.

IMPORTANT OUTPUT RULES:

- Return ONLY a normal Markdown research report.
- NEVER output Python code.
- NEVER output programming code.
- NEVER use triple-backtick code fences.
- NEVER put the report inside a code block.
- NEVER prefix the response with ```markdown.
- Do not reproduce raw tool output.
- Do not reproduce JSON.
- Do not reproduce Python dictionaries.
- Do not explain your instructions.
- Use headings, subheadings, bullet points and normal paragraphs.
- Use ONLY the research provided to you.
- Do not invent facts, statistics or sources.

Return ONLY the final research report."""
    ),

    (
        "human",

        """Write a detailed research report on the topic below.

Topic:
{topic}

Research Gathered:
{research}

Use this structure:

# Introduction

Explain the topic and provide the necessary context.

# Key Findings

Include at least 3 well-explained findings based on the research.

# Conclusion

Summarize the most important insights.

# Sources

List the relevant URLs found in the research.

Requirements:

- Be factual and professional.
- Explain important points instead of just listing them.
- Keep the report easy to read.
- Do not include code.
- Do not include code fences.
- Do not include raw tool output."""
    )

])


writer_chain = (
    writer_prompt
    | llm
    | StrOutputParser()
)


# ============================================================
# CRITIC
# ============================================================

critic_prompt = ChatPromptTemplate.from_messages([

    (
        "system",

        """You are a strict but constructive research critic.

Evaluate the research report for:

- Accuracy
- Clarity
- Completeness
- Organization
- Source quality
- Depth of analysis

Return your response in EXACTLY this format:

Score: X/10

Strengths:
- strength 1
- strength 2
- strength 3

Areas to Improve:
- improvement 1
- improvement 2
- improvement 3

Verdict:
one concise sentence

Rules:

- X must be a number between 0 and 10.
- Be specific.
- Do not use code blocks.
- Do not add extra sections.
- Do not explain the evaluation process."""
    ),

    (
        "human",

        """Review the following research report.

Report:
{report}

Evaluate it strictly according to the instructions."""
    )

])


critic_chain = (
    critic_prompt
    | llm
    | StrOutputParser()
)