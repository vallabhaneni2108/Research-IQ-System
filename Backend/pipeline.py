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
                    f"""Find recent, reliable and detailed information about:

{topic}

Search for multiple relevant sources and include their titles,
URLs and useful information."""
                )
            ]
        })

        state["search_results"] = search_result["messages"][-1].content

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

        reader_result = reader_agent.invoke({
            "messages": [
                (
                    "user",
                    f"""You are a research reader.

Topic:
{topic}

Below are the search results collected by the Search Agent:

{state["search_results"]}

Choose the most relevant URL from these results and scrape it
using your scraping tool.

Focus on extracting detailed information useful for writing
a research report."""
                )
            ]
        })

        state["scraped_content"] = reader_result["messages"][-1].content

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

{state["search_results"]}


DETAILED RESEARCH:

{state["scraped_content"]}
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
            "report": state["report"]
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