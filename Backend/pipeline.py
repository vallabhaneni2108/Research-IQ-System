from agents import (
    build_reader_agent,
    build_search_agent,
    writer_chain,
    critic_chain
)


def run_research_pipeline(topic: str) -> dict:

    state = {
        "topic": topic,
        "search_results": "",
        "scraped_content": "",
        "report": "",
        "feedback": ""
    }

    # ============================================================
    # STEP 1 — SEARCH AGENT
    # ============================================================

    print("\n" + "=" * 60)
    print("STEP 1 - SEARCH AGENT")
    print("=" * 60)

    try:
        search_agent = build_search_agent()

        search_result = search_agent.invoke({
            "messages": [
                (
                    "user",
                    f"""Find recent and reliable information about:

{topic}

Find 3 relevant sources.

Return ONLY:
- Source title
- URL
- One short useful summary per source

Do not write a long explanation.
"""
                )
            ]
        })

        state["search_results"] = search_result["messages"][-1].content

        # HARD LIMIT
        state["search_results"] = state["search_results"][:2500]

        print("\nSearch completed successfully.")
        print(state["search_results"])

    except Exception as e:

        state["search_results"] = f"Search failed: {str(e)}"

        print("\nSearch Agent Error:")
        print(e)

        return state

    # ============================================================
    # STEP 2 — READER AGENT
    # ============================================================

    print("\n" + "=" * 60)
    print("STEP 2 - READER AGENT")
    print("=" * 60)

    try:

        reader_agent = build_reader_agent()

        # Send only limited search information
        limited_search_results = state["search_results"][:2000]

        reader_result = reader_agent.invoke({
            "messages": [
                (
                    "user",
                    f"""You are a research reader.

Topic:
{topic}

Search results:
{limited_search_results}

Choose ONE most relevant URL.

Use the scraping tool to read that URL.

Extract ONLY the most important facts useful for the final report.

Return a concise summary.
Do NOT reproduce the entire webpage.
Do NOT provide a long explanation.
"""
                )
            ]
        })

        state["scraped_content"] = reader_result["messages"][-1].content

        # HARD LIMIT
        state["scraped_content"] = state["scraped_content"][:3000]

        print("\nReader completed successfully.")
        print(state["scraped_content"])

    except Exception as e:

        state["scraped_content"] = f"Reader failed: {str(e)}"

        print("\nReader Agent Error:")
        print(e)

    # ============================================================
    # STEP 3 — WRITER
    # ============================================================

    print("\n" + "=" * 60)
    print("STEP 3 - WRITER")
    print("=" * 60)

    research_combined = f"""
SEARCH RESULTS:

{state["search_results"][:2500]}

DETAILED RESEARCH:

{state["scraped_content"][:3000]}
"""

    try:

        state["report"] = writer_chain.invoke({
            "topic": topic,
            "research": research_combined
        })

        print("\nWriter completed successfully.")
        print("\nFINAL REPORT:\n")
        print(state["report"])

    except Exception as e:

        state["report"] = f"Writer failed: {str(e)}"

        print("\nWriter Error:")
        print(e)

    # ============================================================
    # STEP 4 — CRITIC
    # ============================================================

    print("\n" + "=" * 60)
    print("STEP 4 - CRITIC")
    print("=" * 60)

    try:

        state["feedback"] = critic_chain.invoke({
            "report": state["report"][:6000]
        })

        print("\nCritic completed successfully.")
        print("\nCRITIC REVIEW:\n")
        print(state["feedback"])

    except Exception as e:

        state["feedback"] = f"Critic failed: {str(e)}"

        print("\nCritic Error:")
        print(e)

    # ============================================================
    # FINAL RESULT
    # ============================================================

    return state


# ============================================================
# RUN DIRECTLY
# ============================================================

if __name__ == "__main__":

    topic = input("\nEnter a research topic: ")

    result = run_research_pipeline(topic)

    print("\n" + "=" * 60)
    print("RESEARCH PIPELINE COMPLETED")
    print("=" * 60)