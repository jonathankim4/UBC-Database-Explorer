/*
 * This is the primary high-level API for the project. In this folder there should be:
 * A class called InsightFacade, this should be in a file called InsightFacade.ts.
 * You should not change this interface at all or the test suite will not work.
 */

import Keys = Chai.Keys;
export interface InsightResponse {
    code: number;
    body: {}; // the actual response
}

export interface QueryRequest {
    // you can define your own structure that complies with the EBNF here
    readonly WHERE: FILTER;
    readonly OPTIONS: OPTIONS;
    readonly TRANSFORMATIONS?: TRANSFORMATIONS;
}

export interface TRANSFORMATIONS {
    readonly GROUP: any[];
    readonly APPLY: any[];
}

export interface APPLYKEY {
    readonly string: APPLYTOKEN;
}


export interface APPLYTOKEN {
    readonly MAX?: KEY;
    readonly MIN?: KEY;
    readonly AVG?: KEY;
    readonly COUNT?: KEY;
    readonly SUM?: KEY;
}


export interface FILTER {
    readonly AND?: any[];
    readonly OR?: any[];
    readonly IS?: KEY;
    readonly NOT?: FILTER;

    readonly GT?: KEY;
    readonly LT?: KEY;
    readonly EQ?: KEY;
}

// TODO D3 HAD TO CHANGE TYPE OF COLUMNS: KEY TO COLUMNS: ANY[], IF ANY TESTS FAIL I WILL CHANGE BACK

export interface OPTIONS {
    readonly COLUMNS: any[];
    readonly ORDER?: ORDER;
    readonly FORM: string;
}

// TODO D3 HAD TO CHANGE TYPE OF KEYS: KEY TO KEYS: ANY[], IF ANY TESTS FAIL I WILL CHANGE BACK

export interface ORDER {
    readonly dir?: string;
    readonly keys?: any[];
}



export interface KEY {
    readonly courses_dept?: string;
    readonly courses_id?: string;
    readonly courses_avg?: number;
    readonly courses_instructor?: string;
    readonly courses_title?: string;
    readonly courses_pass?: number;
    readonly courses_fail?: number;
    readonly courses_audit?: number;
    readonly courses_uuid?: string;
    readonly courses_year?: number;
    readonly courses_size?: string;

    readonly rooms_fullname?: string;
    readonly rooms_shortname?: string;
    readonly rooms_number?: string;
    readonly rooms_name?: string;
    readonly rooms_address?: string;
    readonly rooms_lat?: number
    readonly rooms_lon?: number
    readonly rooms_seats?: number
    readonly rooms_type?: string;
    readonly rooms_furniture?: string;
    readonly rooms_href?: string;
}


export interface IInsightFacade {

    /**
     * Add a dataset to UBCInsight.
     *
     * @param id  The id of the dataset being added.
     * @param content  The base64 content of the dataset. This content should be in the
     * form of a serialized zip file.
     *
     * The promise should return an InsightResponse for both fulfill and reject.
     *
     * Fulfill should be for 2XX codes and reject for everything else.
     *
     * After receiving the dataset, it should be processed into a data structure of
     * your design. The processed data structure should be persisted to disk; your
     * system should be able to load this persisted value into memory for answering
     * queries.
     *
     * Ultimately, a dataset must be added or loaded from disk before queries can
     * be successfully answered.
     *
     * Response codes:
     *
     * 201: the operation was successful and the id already existed (was added in
     * this session or was previously cached).
     * 204: the operation was successful and the id was new (not added in this
     * session or was previously cached).
     * 400: the operation failed. The body should contain {"error": "my text"}
     * to explain what went wrong.
     *
     */
    addDataset(id: string, content: string): Promise<InsightResponse>;

    /**
     * Remove a dataset from UBCInsight.
     *
     * @param id  The id of the dataset to remove.
     *
     * The promise should return an InsightResponse for both fulfill and reject.
     *
     * Fulfill should be for 2XX codes and reject for everything else.
     *
     * This will delete both disk and memory caches for the dataset for the id meaning
     * that subsequent queries for that id should fail unless a new addDataset happens first.
     *
     * Response codes:
     *
     * 204: the operation was successful.
     * 404: the operation was unsuccessful because the delete was for a resource that
     * was not previously added.
     *
     */
    removeDataset(id: string): Promise<InsightResponse>;

    /**
     * Perform a query on UBCInsight.
     *
     * @param query  The query to be performed. This is the same as the body of the POST message.
     *
     * @return Promise <InsightResponse>
     *
     * The promise should return an InsightResponse for both fulfill and reject.
     *
     * Fulfill should be for 2XX codes and reject for everything else.
     *
     * Return codes:
     *
     * 200: the query was successfully answered. The result should be sent in JSON according in the response body.
     * 400: the query failed; body should contain {"error": "my text"} providing extra detail.
     * 424: the query failed because it depends on a resource that has not been PUT. The body should contain {"missing": ["id1", "id2"...]}.
     *
     */
    performQuery(query: QueryRequest): Promise<InsightResponse>;
}