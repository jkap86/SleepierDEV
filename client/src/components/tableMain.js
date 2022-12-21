import { avatar } from './functions/misc';


const TableMain = ({ headers, body, keys }) => {



    return <>
        <table className={'main'}>
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
                body.map((item, index) =>
                    <tbody key={index}>
                        <tr className='main'>
                            <td
                                colSpan={item.reduce((acc, cur) => acc + cur.colSpan, 0)}
                            >
                                <table className={'main_body'}>
                                    <tbody>
                                        <tr>
                                            {
                                                item.map((key, index) =>
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