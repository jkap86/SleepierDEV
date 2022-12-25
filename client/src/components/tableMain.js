import { avatar } from './functions/misc';

const TableMain = ({ type, headers, body, page, setPage, itemActive, setItemActive }) => {

    return <>
        {
            (Math.ceil(body?.length / 25) <= 1 || !page) ? null :

                <div className="page_numbers_wrapper">
                    <ol className="page_numbers">
                        {Array.from(Array(Math.ceil(body.length / 25)).keys()).map(page_number =>
                            <li className={page === page_number + 1 ? 'active click' : 'click'} key={page_number + 1} onClick={() => setPage(page_number + 1)}>
                                {page_number + 1}
                            </li>
                        )}
                    </ol>
                </div>
        }


        <table className={type}>
            <thead>
                {
                    headers?.map((header, index) =>
                        <tr key={index}>
                            {
                                header.map((key, index) =>
                                    <th
                                        key={index}
                                        colSpan={key.colSpan}
                                        rowSpan={key.rowSpan}
                                        className={key.className}
                                    >
                                        {
                                            key.text
                                        }
                                    </th>
                                )
                            }
                        </tr>
                    )
                }
            </thead>
            {
                body
                    ?.slice(Math.max(((page || 1) - 1) * 25, 0), (((page || 1) - 1) * 25) + 25)
                    ?.map((item, index) =>
                        <tbody key={index}>
                            <tr className={`${type}_wrapper`}>
                                <td
                                    colSpan={item.list.reduce((acc, cur) => acc + cur.colSpan, 0)}
                                >
                                    <table className={`${type}_body`}>
                                        <tbody>
                                            <tr
                                                className={`${type} click`}
                                                onClick={() => setItemActive(prevState => prevState === item.id ? '' : item.id)}
                                            >
                                                {
                                                    item.list
                                                        .filter(x => x.text)
                                                        .map((key, index) =>
                                                            <td
                                                                key={index}
                                                                colSpan={key.colSpan}
                                                                className={key.className}
                                                            >
                                                                {
                                                                    key.image ?
                                                                        <p>
                                                                            {
                                                                                avatar(
                                                                                    key.image.src, key.image.alt, key.image.type
                                                                                )
                                                                            }
                                                                            {key.text}
                                                                        </p>
                                                                        :
                                                                        key.text
                                                                }
                                                            </td>
                                                        )
                                                }
                                            </tr>
                                            {
                                                (itemActive !== item.id || !item.secondary_table) ? null :
                                                    <tr>
                                                        <td colSpan={item.list.reduce((acc, cur) => acc + cur.colSpan, 0)}>
                                                            {item.secondary_table}
                                                        </td>
                                                    </tr>
                                            }
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    )
            }
        </table>
    </>
}

export default TableMain;